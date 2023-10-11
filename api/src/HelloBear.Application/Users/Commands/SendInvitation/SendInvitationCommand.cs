using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Application.Users.EventHandlers.SendInvitation;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace HelloBear.Application.Users.Commands.SendInvitation;

public record SendInvitationCommand(string Id) : IRequest<OperationResult>;

public class SendInvitationCommandHandler : IRequestHandler<SendInvitationCommand, OperationResult>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IPublisher _publisher;

    public SendInvitationCommandHandler(
        UserManager<ApplicationUser> userManager,
        IPublisher publisher)
    {
        _userManager = userManager;
        _publisher = publisher;
    }

    public async Task<OperationResult> Handle(SendInvitationCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id);

        if (user is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.AccountNotExists}", $"The resource you have requested cannot be found");
        }

        if (user.EmailConfirmed || user.Status == Domain.Enums.UserStatus.Actived)
        {
            return OperationResult.Forbidden($"{AppConstants.ResponseCodeMessage.AccountActive}", "Your account has been activated.");
        }

        if (user.Status == Domain.Enums.UserStatus.Deactivated)
        {
            return OperationResult.Forbidden($"{AppConstants.ResponseCodeMessage.AccountDeactive}", "Your account has been deactivated.");
        }

        await _publisher.Publish(new SendInvitationEvent(user), cancellationToken);

        return OperationResult.Ok();
    }
}
