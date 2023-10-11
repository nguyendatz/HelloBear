namespace HelloBear.Application.Common.Models.OperationResults;

public record ForbiddenResult : OperationResult
{
    public ForbiddenResult()
        : base(OperationResultStatusCode.Forbidden)
    { }

    public ForbiddenResult(string? title, string? detail)
        : base(OperationResultStatusCode.Forbidden, title, detail)
    { }
}