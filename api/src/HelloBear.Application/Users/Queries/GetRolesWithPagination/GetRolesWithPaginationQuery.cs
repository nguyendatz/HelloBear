using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.Users.Queries.GetRolesWithPagination;

public record GetRolesWithPaginationQuery : PageQueryWithSearchTextBase, IRequest<PaginatedList<RoleResponse>>
{
}

public class RoleResponse
{
    public string Id { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;
}

public class GetRolesQueryHandler : IRequestHandler<GetRolesWithPaginationQuery, PaginatedList<RoleResponse>>
{
    private readonly IApplicationDbContext _db;
    private readonly IMapper _mapper;

    public GetRolesQueryHandler(IApplicationDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    public async Task<PaginatedList<RoleResponse>> Handle(GetRolesWithPaginationQuery request, CancellationToken cancellationToken)
    {
        return await _db.Roles
            .Where(r => r.Name != AppConstants.SuperAdminRole)
            .ProjectToPaginatedListAsync<ApplicationRole, RoleResponse>(request, _mapper.ConfigurationProvider, cancellationToken);
    }
}