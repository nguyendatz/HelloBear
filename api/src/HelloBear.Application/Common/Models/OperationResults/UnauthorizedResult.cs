namespace HelloBear.Application.Common.Models.OperationResults;

public record UnauthorizedResult : OperationResult
{
    public UnauthorizedResult()
        : base(OperationResultStatusCode.Unauthorized)
    { }

    public UnauthorizedResult(string? title, string? detail)
        : base(OperationResultStatusCode.Unauthorized, title, detail)
    { }
}