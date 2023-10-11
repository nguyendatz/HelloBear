using FluentValidation;

namespace HelloBear.Application.Communities.Commands.UploadImage;

public class UploadImageCommandValidator : AbstractValidator<UploadImageCommand>
{
    public UploadImageCommandValidator()
    {
        RuleFor(v => v.StudentId)
            .NotEqual(0);

        RuleFor(v => v.ClassId)
            .NotEqual(0);

        RuleFor(v => v.LessionId)
            .NotEqual(0);
    }
}