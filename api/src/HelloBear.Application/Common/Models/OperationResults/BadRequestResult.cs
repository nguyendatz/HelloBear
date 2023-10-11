using System.ComponentModel.DataAnnotations;

namespace HelloBear.Application.Common.Models.OperationResults;

public record BadRequestResult : OperationResult
{
    public BadRequestResult()
        : base(OperationResultStatusCode.BadRequest)
    { }

    public BadRequestResult(string? title, string? detail)
        : base(OperationResultStatusCode.BadRequest, title, detail)
    { }

    public BadRequestResult(IEnumerable<ValidationResult?> validationResults)
       : base(OperationResultStatusCode.BadRequest) => ValidationResults = validationResults;

    public IEnumerable<ValidationResult?> ValidationResults { get; } = Array.Empty<ValidationResult?>();
}