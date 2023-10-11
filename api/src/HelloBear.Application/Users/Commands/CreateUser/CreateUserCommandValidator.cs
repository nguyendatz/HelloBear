using FluentValidation;

namespace HelloBear.Application.Users.Commands.CreateUser;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(v => v.FirstName)
            .MaximumLength(256)
            .NotEmpty();

        RuleFor(v => v.LastName)
            .MaximumLength(256)
            .NotEmpty();

        RuleFor(v => v.Email)
            .MaximumLength(256)
            .NotEmpty();
    }
}
