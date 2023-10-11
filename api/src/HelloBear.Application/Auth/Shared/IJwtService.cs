using System.Security.Claims;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Auth.Shared;

public interface IJwtService : ITransientService
{
    string GenerateAccessToken(ApplicationUser user, IList<Claim> userClaims, IList<string> roles);

    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);

    string GenerateRefreshToken(int length = 32);

    bool IsRefreshTokenExpired(string refreshToken);
}