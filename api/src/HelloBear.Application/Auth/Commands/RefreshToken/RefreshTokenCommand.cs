using System.Security.Claims;
using HelloBear.Application.Auth.Commands.Login;
using HelloBear.Application.Auth.Shared;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace HelloBear.Application.Auth.Commands.RefreshToken;

public class RefreshTokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}

public record RefreshTokenCommand : IRequest<OperationResult<LoginResponse>>
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, OperationResult<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(UserManager<ApplicationUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<OperationResult<LoginResponse>> Handle(RefreshTokenCommand command, CancellationToken cancellationToken)
    {
        var principal = _jwtService.GetPrincipalFromExpiredToken(command.AccessToken);
        if (principal is null)
        {
            return OperationResult.Unauthorized("The expired access token does not contain user information");
        }

        var userName = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userName is null)
        {
            return OperationResult.Unauthorized("No account was found");
        }

        var user = await _userManager.FindByNameAsync(userName);
        if (user is null || user.RefreshToken != command.RefreshToken || user.Status != Domain.Enums.UserStatus.Actived)
        {
            return OperationResult.BadRequest("Invalid client request");
        }
        if (_jwtService.IsRefreshTokenExpired(user.RefreshToken))
        {
            return OperationResult.BadRequest("The refresh token has expired.");
        }

        var userClaims = await _userManager.GetClaimsAsync(user) ?? new List<Claim>();
        var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();

        var accessToken = _jwtService.GenerateAccessToken(user, userClaims, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        await _userManager.UpdateAsync(user);

        return OperationResult.Ok(new LoginResponse
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Role = roles.First()
        });
    }
}