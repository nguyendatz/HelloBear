using FluentValidation;

namespace HelloBear.Application.Users.Commands.UpdateUser;

public class UpdateTodoItemCommandValidator : AbstractValidator<UpdateUserCommand>
{
    public UpdateTodoItemCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty();
    }
}
