using FluentValidation;

namespace HelloBear.Application.Auth.Commands.UpdatePassword;

public class UpdatePasswordCommandValidator : AbstractValidator<UpdatePasswordCommand>
{
    public UpdatePasswordCommandValidator()
    {
        RuleFor(v => v.Token)
            .NotEmpty();

        RuleFor(v => v.Password)
            .MinimumLength(8)
            .NotEmpty();

        RuleFor(v => v.UserId)
            .MaximumLength(256)
            .NotEmpty();

        RuleFor(v => v.Purpose)
            .NotEmpty();
    }
}
