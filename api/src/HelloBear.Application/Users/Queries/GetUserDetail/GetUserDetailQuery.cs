using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace HelloBear.Application.Users.Queries.GetUsersWithPagination;

public record GetUserDetailQuery : PageQueryWithSearchTextBase, IRequest<UserDetailResponse?>
{
    public string Id { get; set; } = string.Empty;
}

public class UserDetailResponse
{
    public string Id { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string RoleId { get; set; } = string.Empty;

    public UserStatus Status { get; set; } = UserStatus.Invited;

    public string? PhoneNumber { get; set; }

    public PhoneType? PhoneType { get; set; }
}

public class GetUserDetailQueryHandler : IRequestHandler<GetUserDetailQuery, UserDetailResponse?>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    public GetUserDetailQueryHandler(UserManager<ApplicationUser> userManager, IMapper mapper)
    {
        _userManager = userManager;
        _mapper = mapper;
    }

    public async Task<UserDetailResponse?> Handle(GetUserDetailQuery request, CancellationToken cancellationToken)
    {
        return (await _userManager.Users
            .Where(x => x.Id == request.Id)
            .ProjectToPaginatedListAsync<ApplicationUser, UserDetailResponse>(request, _mapper.ConfigurationProvider, cancellationToken))
            .Items.FirstOrDefault();
    }
}