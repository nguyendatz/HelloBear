using FluentValidation;

namespace HelloBear.Application.Lessons.Commands.UpdateLesson;

public class UpdateLessonCommandValidator : AbstractValidator<UpdateLessonCommand>
{
    public UpdateLessonCommandValidator()
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