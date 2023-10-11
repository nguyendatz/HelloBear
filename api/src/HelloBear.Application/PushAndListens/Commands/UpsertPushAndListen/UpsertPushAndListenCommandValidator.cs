using FluentValidation;

namespace HelloBear.Application.PushAndListens.Commands.UpsertPushAndListen;

public class UpsertPushAndListenCommandValidator : AbstractValidator<UpsertPushAndListenCommand>
{
    public UpsertPushAndListenCommandValidator()
    {
        RuleFor(v => v.AudioFileUrl)
            .NotEmpty();

        RuleFor(v => v.OriginalWidth)
            .GreaterThan(0);

        RuleFor(v => v.OriginalHeight)
            .GreaterThan(0);
    }
}
