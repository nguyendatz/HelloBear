namespace HelloBear.Application.Common.Models.OperationResults;

public record NotFoundResult : OperationResult
{
    public NotFoundResult()
        : base(OperationResultStatusCode.NotFound, "Resource not found", "The resource you have requested cannot be found")
    { }

    public NotFoundResult(string? title, string? detail)
        : base(OperationResultStatusCode.NotFound, title, detail)
    { }
}