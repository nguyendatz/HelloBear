using FluentValidation;

namespace HelloBear.Application.Contents.Commands.UpdateContent;

public class UpdateContentCommandValidator : AbstractValidator<UpdateContentCommand>
{
    public UpdateContentCommandValidator()
    {
        RuleFor(v => v.BodyRequest.LessonId)
            .GreaterThan(0)
            .NotNull();

        RuleFor(v => v.BodyRequest.PageNumber)
            .GreaterThan(0)
            .NotNull();

        RuleFor(v => v.BodyRequest.Name)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.PageImage)
            .NotEmpty();

        RuleFor(v => v.BodyRequest.YoutubeLink)
            .NotEmpty()
            .When(content => content.BodyRequest.Type == Domain.Enums.ContentType.Read ||
            content.BodyRequest.Type == Domain.Enums.ContentType.Music ||
            content.BodyRequest.Type == Domain.Enums.ContentType.Video);

        RuleFor(v => v.BodyRequest.WordwallNetLink)
            .NotEmpty()
            .When(content => content.BodyRequest.Type == Domain.Enums.ContentType.Game);
    }
}