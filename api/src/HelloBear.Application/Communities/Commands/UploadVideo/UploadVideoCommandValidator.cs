using FluentValidation;

namespace HelloBear.Application.Communities.Commands.UploadVideo;

public class UploadVideoCommandValidator : AbstractValidator<UploadVideoCommand>
{
    public UploadVideoCommandValidator()
    {
        RuleFor(v => v.Title)
            .NotEmpty();

        RuleFor(v => v.LessionId)
            .NotEqual(0);

        RuleFor(v => v.ClassId)
            .NotEqual(0);

        RuleFor(v => v.StudentId)
            .NotEqual(0);
    }
}