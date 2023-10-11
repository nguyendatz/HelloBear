using FluentValidation;

namespace HelloBear.Application.Classes.Commands.CreateClass;

public class CreateClassCommandValidator : AbstractValidator<CreateClassCommand>
{
    public CreateClassCommandValidator()
    {
        RuleFor(v => v.BodyRequest.TextBookId)
            .NotNull();

        RuleFor(v => v.BodyRequest.ClassName)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.StartDate)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.EndDate)
            .NotEmpty()
            .GreaterThanOrEqualTo(v => v.BodyRequest.StartDate);
    }
}
