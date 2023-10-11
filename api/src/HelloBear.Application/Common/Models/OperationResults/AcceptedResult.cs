namespace HelloBear.Application.Common.Models.OperationResults;

public record AcceptedResult : OperationResult
{
    public AcceptedResult()
        : base(OperationResultStatusCode.Accepted)
    { }
}

public record AcceptedResult<TValue> : OperationResult<TValue>
{
    public AcceptedResult(TValue value)
        : base(OperationResultStatusCode.Accepted, value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));

        Value = value;
    }
}