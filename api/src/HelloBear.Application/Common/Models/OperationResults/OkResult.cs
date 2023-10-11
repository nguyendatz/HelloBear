namespace HelloBear.Application.Common.Models.OperationResults;

public record OkResult : OperationResult
{
    public OkResult()
        : base(OperationResultStatusCode.Ok)
    { }
}

public record OkResult<TValue> : OperationResult<TValue>
{
    public OkResult(TValue value)
        : base(OperationResultStatusCode.Ok, value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));

        Value = value;
    }
}