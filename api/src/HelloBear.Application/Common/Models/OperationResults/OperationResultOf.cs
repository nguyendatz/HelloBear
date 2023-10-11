namespace HelloBear.Application.Common.Models.OperationResults;

public record OperationResult<TValue>
{
    public OperationResult(OperationResultStatusCode statusCode, TValue value)
    {
        Status = new OperationStatus(statusCode);
        Value = value;
    }

    public OperationResult(OperationResult result, TValue value = default)
    {
        Status = result.Status;
        Value = value;
    }

    public OperationStatus Status { get; set; }

    public TValue Value { get; set; }

    public bool Succeeded => (int)Status.StatusCode >= 200 && (int)Status.StatusCode < 300;

    public static implicit operator OperationResult<TValue>(OperationResult result)
    {
        return new OperationResult<TValue>(result);
    }

    public OperationResult ToOperationResult()
    {
        return new OperationResult(Status);
    }
}