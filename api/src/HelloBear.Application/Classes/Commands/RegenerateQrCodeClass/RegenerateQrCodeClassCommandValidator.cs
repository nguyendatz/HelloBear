using FluentValidation;

namespace HelloBear.Application.Classes.Commands.GenerateQrCode;

public class RegenerateQrCodeClassCommandValidator : AbstractValidator<RegenerateQrCodeClassCommand>
{
    public RegenerateQrCodeClassCommandValidator()
    {
        RuleFor(v => v.Id)
            .NotEmpty();
    }
}
