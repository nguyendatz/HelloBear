using FluentValidation;

namespace HelloBear.Application.Users.Commands.SendInvitation;

public class SendInvitationCommandValidator : AbstractValidator<SendInvitationCommand>
{
    public SendInvitationCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty();
    }
}
