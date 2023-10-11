using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Settings;

namespace HelloBear.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserName => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
}
