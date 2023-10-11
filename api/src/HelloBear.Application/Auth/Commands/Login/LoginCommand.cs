using System.Security.Claims;
using HelloBear.Application.Auth.Shared;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace HelloBear.Application.Auth.Commands.Login;

public record LoginCommand : IRequest<OperationResult<LoginResponse>>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool IsRemember { get; set; }
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, OperationResult<LoginResponse>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(UserManager<ApplicationUser> userManager, IJwtService jwtService)
    {
        _userManager = userManager;
        _jwtService = jwtService;
    }

    public async Task<OperationResult<LoginResponse>> Handle(LoginCommand loginCommand, CancellationToken cancellationToken)
    {
        ApplicationUser? user = await _userManager.FindByEmailAsync(loginCommand.Email);
        if (user is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.AccountNotExists}", $"The resource you have requested cannot be found");
        }

        if (!user.EmailConfirmed || user.Status == Domain.Enums.UserStatus.Invited)
        {
            return OperationResult.Forbidden($"{AppConstants.ResponseCodeMessage.AccountIncomplete}", "Account activation is incomplete. Please check inbox for verification email.");
        }

        if (user.Status != Domain.Enums.UserStatus.Actived)
        {
            return OperationResult.Forbidden($"{AppConstants.ResponseCodeMessage.AccountDeactive}", "Your account has been deactivated.");
        }

        var authenticated = await _userManager.CheckPasswordAsync(user, loginCommand.Password);

        if (!authenticated)
        {
            return OperationResult.Unauthorized();
        }

        var userClaims = await _userManager.GetClaimsAsync(user) ?? new List<Claim>();
        var roles = await _userManager.GetRolesAsync(user) ?? new List<string>();

        string accessToken = _jwtService.GenerateAccessToken(user, userClaims, roles);
        string refreshToken = string.Empty;

        if (loginCommand.IsRemember)
        {
            refreshToken = _jwtService.GenerateRefreshToken();

            // Update refresh token
            user.RefreshToken = refreshToken;
            await _userManager.UpdateAsync(user);
        }

        var result = new LoginResponse
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            Role = roles.First()
        };

        return OperationResult.Ok(result);
    }
}