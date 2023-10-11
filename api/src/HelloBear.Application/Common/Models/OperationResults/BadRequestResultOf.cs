using System.ComponentModel.DataAnnotations;

namespace HelloBear.Application.Common.Models.OperationResults;

public record BadRequestResult<TValue> : OperationResult<TValue>
{
    public BadRequestResult(IEnumerable<ValidationResult?> validationResults, TValue value = default)
        : base(OperationResultStatusCode.BadRequest, value)
        => ValidationResults = validationResults;

    public IEnumerable<ValidationResult?> ValidationResults { get; } = new ValidationResult?[] { };
}