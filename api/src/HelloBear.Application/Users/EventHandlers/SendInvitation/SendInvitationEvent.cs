using System.Reflection;
using System.Text;
using FluentEmail.Core;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Users.EventHandlers.SendInvitation;

public record SendInvitationEvent(ApplicationUser User) : INotification;

public class SendInvitationEventHandler : INotificationHandler<SendInvitationEvent>
{
    private const string TemplateName = "send-invitation.liquid";

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SystemSetting _systemSetting;
    private readonly IFluentEmail _fluentEmail;

    public SendInvitationEventHandler(
        UserManager<ApplicationUser> userManager,
        IOptions<SystemSetting> systemSetting,
        IFluentEmail fluentEmail)
    {
        _userManager = userManager;
        _systemSetting = systemSetting.Value;
        _fluentEmail = fluentEmail;
    }

    public async Task Handle(SendInvitationEvent notification, CancellationToken cancellationToken)
    {
        string token = await _userManager.GenerateEmailConfirmationTokenAsync(notification.User);
        string encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        string setPasswordUrl = $"{_systemSetting.ClientAppBaseUrl}{_systemSetting.ClientAppSetPasswordPath}";
        IDictionary<string, string> queryStrings = new Dictionary<string, string>
            {
                { "userId", notification.User.Id.ToString() },
                { "token", encodedToken },
                { "purpose", UserManager<ApplicationUser>.ConfirmEmailTokenPurpose }
            };
        string invitationLink = QueryHelpers.AddQueryString(setPasswordUrl, queryStrings);
        string logoUrl = $"{_systemSetting.ApiBaseUrl}/{AppConstants.EmailSignaturePath}";

        var type = GetType();
        var embeddedTemplateFile = $"{type.Namespace}.{TemplateName}";
        var email = _fluentEmail
                    .To(notification.User.Email)
                    .Subject(_systemSetting.InvitationEmailSubject)
                    .UsingTemplateFromEmbedded(embeddedTemplateFile, new
                    {
                        Name = $"{notification.User.FirstName} {notification.User.LastName}",
                        InvitationLink = invitationLink,
                        ContactInfo = _systemSetting.ContactInfo,
                        ContactInfoUrl = _systemSetting.ContactInfoUrl,
                        LogoUrl = logoUrl
                    },
                    Assembly.GetAssembly(type));

        // Make it run in background so that we don't wait the response, the detail of FluentEmail.Send is got slow if we await it
        // Taken from https://stackoverflow.com/questions/28333396/smtpclient-sendmailasync-causes-deadlock-when-throwing-a-specific-exception/28445791#28445791
        // SmtpClient causes deadlock when throwing exceptions. This fixes that.
        _ = Task.Run(() => email.Send());
    }
}