using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;

namespace HelloBear.Application.Users.Queries.GetUsersWithPagination;

public record GetUsersWithPaginationQuery : PageQueryWithSearchTextBase, IRequest<PaginatedList<UserListResponse>>
{
    public IEnumerable<string>? Roles { get; set; }
}

public class UserListResponse
{
    public string? Id { get; set; }

    public string? Email { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? FullName { get; set; }

    public DateTimeOffset DateCreated { get; set; }

    public UserStatus Status { get; set; } = UserStatus.Invited;

    public IEnumerable<string> Roles { get; set; } = Enumerable.Empty<string>();
}

public class GetUsersWithPaginationQueryHandler : IRequestHandler<GetUsersWithPaginationQuery, PaginatedList<UserListResponse>>
{
    private readonly IApplicationDbContext _db;
    private readonly IMapper _mapper;

    public GetUsersWithPaginationQueryHandler(IApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<PaginatedList<UserListResponse>> Handle(GetUsersWithPaginationQuery request, CancellationToken cancellationToken)
    {
        IQueryable<ApplicationUser> query = _db.Users.Where(u => u.Roles.Any(r => r.Name != AppConstants.SuperAdminRole));

        if (request.Roles != null)
        {
            query = query.Where(x => x.Roles.Any() && request.Roles.Contains(x.Roles.First().Name));
        }

        if (!string.IsNullOrEmpty(request.SearchText))
        {
            query = query.Where(x =>
                x.FirstName.Contains(request.SearchText)
                || x.LastName.Contains(request.SearchText)
                || (x.Email != null && x.Email.Contains(request.SearchText))
                || x.Roles.Any(y => y.Name != null && y.Name.Contains(request.SearchText)));
        }

        if (request.SortCriteria.IsNullOrEmpty())
        {
            query = query.OrderBy(x => x.FirstName);
        }

        PaginatedList<UserListResponse> result = await query.ProjectToPaginatedListAsync<ApplicationUser, UserListResponse>(request, _mapper.ConfigurationProvider, cancellationToken);

        return result;
    }
}