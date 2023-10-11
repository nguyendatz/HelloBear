using System.Reflection;
using System.Text;
using FluentEmail.Core;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Auth.Commands.UpdatePassword;

public record UpdatePasswordCommand : IRequest<OperationResult<UpdatePasswordResponse>>
{
    public string Token { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
}

public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, OperationResult<UpdatePasswordResponse>>
{
    private const string TemplateName = "confirmed-password-changed.liquid";

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IApplicationDbContext _context;
    private readonly SystemSetting _systemSetting;
    private readonly IFluentEmail _fluentEmail;

    public UpdatePasswordCommandHandler(UserManager<ApplicationUser> userManager, IApplicationDbContext context, IFluentEmail fluentEmail, IOptions<SystemSetting> systemSetting)
    {
        _userManager = userManager;
        _context = context;
        _systemSetting = systemSetting.Value;
        _fluentEmail = fluentEmail;
    }

    public async Task<OperationResult<UpdatePasswordResponse>> Handle(UpdatePasswordCommand updatePasswordCommand, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(updatePasswordCommand.UserId);

        if (user is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.AccountNotExists}", $"The resource you have requested cannot be found");
        }

        string decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(updatePasswordCommand.Token));

        var isUserTokenValid = await _userManager.VerifyUserTokenAsync(user, TokenOptions.DefaultProvider, updatePasswordCommand.Purpose, decodedToken);
        if (!isUserTokenValid)
        {
            return OperationResult.BadRequest($"{AppConstants.ResponseCodeMessage.UserTokenValid}", "The link has been expired or invalid.");
        }

        if (updatePasswordCommand.Purpose == UserManager<ApplicationUser>.ResetPasswordTokenPurpose)
        {
            var checkSamePreviousPassword = await _userManager.CheckPasswordAsync(user, updatePasswordCommand.Password);
            if (checkSamePreviousPassword)
            {
                return OperationResult.BadRequest($"{AppConstants.ResponseCodeMessage.NewPasswordIsSameOldPassword}", "Your new password cannot be the same as your current password. Please try another password.");
            }

            IdentityResult iResult = await _userManager.ResetPasswordAsync(user, decodedToken, updatePasswordCommand.Password);
            if (!iResult.Succeeded)
            {
                string[] errors = iResult.Errors.Select(error => $"{error.Code}:{error.Description}").ToArray();
                return OperationResult.Error("The new password could not be assigned." + Environment.NewLine + string.Join(Environment.NewLine, errors));
            }
        }
        else if (updatePasswordCommand.Purpose == UserManager<ApplicationUser>.ConfirmEmailTokenPurpose)
        {
            IdentityResult iResult = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (iResult.Succeeded)
            {
                user.Status = UserStatus.Actived;
                await _context.SaveChangesAsync(cancellationToken);

                iResult = await _userManager.AddPasswordAsync(user, updatePasswordCommand.Password);
            }

            if (!iResult.Succeeded)
            {
                string[] errors = iResult.Errors.Select(error => $"{error.Code}:{error.Description}").ToArray();
                return OperationResult.Error("The new password could not be assigned." + Environment.NewLine + string.Join(Environment.NewLine, errors));
            }
        }

        await SendConfirmedPasswordChangedEmail(user);

        var result = new UpdatePasswordResponse
        {
            Email = user.Email,
            FullName = user.FullName
        };
        return OperationResult.Ok(result);
    }

    private Task SendConfirmedPasswordChangedEmail(ApplicationUser user)
    {
        string logoUrl = $"{_systemSetting.ApiBaseUrl}/{AppConstants.EmailSignaturePath}";

        // This is the sample on how to use FluentEmail, please update it correctly with the business logic
        var type = GetType();
        var embeddedTemplateFile = $"{type.Namespace}.{TemplateName}";

        var email = _fluentEmail
                    .To(user.Email)
                    .Subject(_systemSetting.ConfirmedPasswordChangedEmailSubject)
                    .UsingTemplateFromEmbedded(embeddedTemplateFile, new
                    {
                        Name = $"{user.FirstName} {user.LastName}",
                        ContactInfo = _systemSetting.ContactInfo,
                        ContactInfoUrl = _systemSetting.ContactInfoUrl,
                        LogoUrl = logoUrl
                    },
                    Assembly.GetAssembly(type)); ;

        _ = Task.Run(() => email.Send());
        return Task.CompletedTask;
    }
}