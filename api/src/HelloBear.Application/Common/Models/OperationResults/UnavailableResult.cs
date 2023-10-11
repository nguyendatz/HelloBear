namespace HelloBear.Application.Common.Models.OperationResults;

public record UnavailableResult : OperationResult
{
    public UnavailableResult()
        : base(OperationResultStatusCode.Unavailable)
    { }

    public UnavailableResult(string? title, string? detail)
        : base(OperationResultStatusCode.Unavailable, title, detail)
    { }
}