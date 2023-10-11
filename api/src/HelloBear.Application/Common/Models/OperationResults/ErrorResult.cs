namespace HelloBear.Application.Common.Models.OperationResults;

public record ErrorResult : OperationResult
{
    public ErrorResult()
        : base(OperationResultStatusCode.Error)
    { }

    public ErrorResult(string? title, string? detail)
        : base(OperationResultStatusCode.Error, title, detail)
    { }
}