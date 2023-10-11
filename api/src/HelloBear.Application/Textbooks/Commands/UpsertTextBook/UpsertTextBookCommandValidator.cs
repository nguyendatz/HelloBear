using FluentValidation;

namespace HelloBear.Application.TextBooks.Commands.UpsertTextBook;

public class UpsertTextBookCommandValidator : AbstractValidator<UpsertTextBookCommand>
{
    public UpsertTextBookCommandValidator()
    {
        RuleFor(v => v.Name)
            .MaximumLength(256)
            .NotEmpty();

        RuleFor(v => v.ShortName)
            .MaximumLength(3)
            .NotEmpty();
    }
}
