using System.Reflection;
using System.Text;
using FluentEmail.Core;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Auth.Commands.ForgotPassword;

public record ForgotPasswordCommand : IRequest<OperationResult<ForgotPasswordResponse>>
{
    public string Email { get; set; } = string.Empty;
}

public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, OperationResult<ForgotPasswordResponse>>
{
    private const string TemplateName = "reset-password.liquid";

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SystemSetting _systemSetting;
    private readonly IFluentEmail _fluentEmail;

    public ForgotPasswordCommandHandler(UserManager<ApplicationUser> userManager, IFluentEmail fluentEmail, IOptions<SystemSetting> systemSetting)
    {
        _userManager = userManager;
        _systemSetting = systemSetting.Value;
        _fluentEmail = fluentEmail;
    }

    public async Task<OperationResult<ForgotPasswordResponse>> Handle(ForgotPasswordCommand forgotPasswordCommand, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(forgotPasswordCommand.Email);

        if (user is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.AccountNotExists}", $"The resource you have requested cannot be found");
        }

        if (!user.EmailConfirmed || user.Status == Domain.Enums.UserStatus.Invited)
        {
            return OperationResult.Forbidden($"{AppConstants.ResponseCodeMessage.AccountIncomplete}", "Your account has not been activated.");
        }

        if (user.Status == Domain.Enums.UserStatus.Deactivated)
        {
            return OperationResult.Forbidden($"{AppConstants.ResponseCodeMessage.AccountDeactive}", "Your account has been deactivated.");
        }

        await SendPasswordResetEmail(user);

        var result = new ForgotPasswordResponse { Email = user.Email, FullName = user.FullName };

        return OperationResult.Ok(result);
    }

    private async Task SendPasswordResetEmail(ApplicationUser user)
    {
        string token = await _userManager.GeneratePasswordResetTokenAsync(user);
        string encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        string setPasswordUrl = $"{_systemSetting.ClientAppBaseUrl}{_systemSetting.ClientAppSetPasswordPath}";
        IDictionary<string, string> queryStrings = new Dictionary<string, string>
            {
                { "userId", user.Id.ToString() },
                { "token", encodedToken },
                { "purpose", UserManager<ApplicationUser>.ResetPasswordTokenPurpose }
            };
        string passwordResetLink = QueryHelpers.AddQueryString(setPasswordUrl, queryStrings);
        string logoUrl = $"{_systemSetting.ApiBaseUrl}/{AppConstants.EmailSignaturePath}";

        // This is the sample on how to use FluentEmail, please update it correctly with the business logic
        var type = GetType();
        var embeddedTemplateFile = $"{type.Namespace}.{TemplateName}";
        var email = _fluentEmail
                    .To(user.Email)
                    .Subject(_systemSetting.ResetPasswordEmailSubject)
                    .UsingTemplateFromEmbedded(embeddedTemplateFile, new
                    {
                        Name = $"{user.FirstName} {user.LastName}",
                        PasswordResetLink = passwordResetLink,
                        ContactInfo = _systemSetting.ContactInfo,
                        ContactInfoUrl = _systemSetting.ContactInfoUrl,
                        LogoUrl = logoUrl
                    },
                    Assembly.GetAssembly(type));

        _ = Task.Run(() => email.Send());
    }
}