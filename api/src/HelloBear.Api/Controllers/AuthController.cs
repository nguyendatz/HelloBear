using HelloBear.Application.Auth.Commands.ForgotPassword;
using HelloBear.Application.Auth.Commands.Login;
using HelloBear.Application.Auth.Commands.RefreshToken;
using HelloBear.Application.Auth.Commands.UpdatePassword;
using HelloBear.Application.Auth.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

public class AuthController : ApiControllerBase
{
    [HttpPost("login")]
    public Task<ActionResult<LoginResponse>> Login(LoginCommand loginCommand)
        => HandleRequest(loginCommand);

    [HttpPost("forgot-password")]
    public Task<ActionResult<ForgotPasswordResponse>> ForgotPassword(ForgotPasswordCommand forgotPasswordCommand)
        => HandleRequest(forgotPasswordCommand);

    [HttpPost("update-password")]
    public Task<ActionResult<UpdatePasswordResponse>> UpdatePassword(UpdatePasswordCommand updatePasswordCommand)
        => HandleRequest(updatePasswordCommand);

    [HttpPost("refresh-token")]
    public Task<ActionResult<LoginResponse>> RefreshToken(RefreshTokenCommand command)
        => HandleRequest(command);
}