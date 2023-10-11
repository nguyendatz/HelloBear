namespace HelloBear.Application.Common.Models.OperationResults;

public record CreatedResult<TValue> : OperationResult<TValue>
{
    public CreatedResult(TValue value)
        : base(OperationResultStatusCode.Created, value)
    {
        if (value == null)
            throw new ArgumentNullException(nameof(value));
    }

    public CreatedResult(string id, TValue value)
        : this(value)
    {
        Id = id;
    }

    public CreatedResult(Guid id, TValue value)
        : this(value)
    {
        Id = id.ToString();
    }

    public CreatedResult(int id, TValue value)
        : this(value)
    {
        Id = id.ToString();
    }

    public string? Id { get; set; }
}