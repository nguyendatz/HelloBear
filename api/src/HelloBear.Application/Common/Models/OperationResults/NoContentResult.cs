namespace HelloBear.Application.Common.Models.OperationResults;

public record NoContentResult : OperationResult
{
    public NoContentResult()
        : base(OperationResultStatusCode.NoContent)
    { }
}