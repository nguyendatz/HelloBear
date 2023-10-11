using FluentValidation;

namespace HelloBear.Application.Lessons.Commands.CreateLesson;

public class CreateLessonCommandValidator : AbstractValidator<CreateLessonCommand>
{
    public CreateLessonCommandValidator()
    {
        RuleFor(v => v.BodyRequest.TextBookId)
            .NotNull();

        RuleFor(v => v.BodyRequest.Number)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.Name)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.LanguageFocus)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.Phonics)
            .NotEmpty();
    }
}