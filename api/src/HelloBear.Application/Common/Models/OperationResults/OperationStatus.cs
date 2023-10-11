namespace HelloBear.Application.Common.Models.OperationResults;

/// <summary>
/// This response is styled on the optional standard for error responses defined in RFC-7807
/// (https://tools.ietf.org/html/rfc7807), but we're not using the Type property
/// </summary>
public record OperationStatus
{
    public OperationStatus(OperationResultStatusCode statusCode) => StatusCode = statusCode;

    public OperationStatus(OperationResultStatusCode statusCode, string? title, string? detail)
        : this(statusCode)
    {
        Title = title;
        Detail = detail;
    }

    public string? Title { get; set; }

    public OperationResultStatusCode StatusCode { get; set; }

    public string? Detail { get; set; }

    public bool HasDetails() => string.IsNullOrWhiteSpace(Title) == false || string.IsNullOrWhiteSpace(Detail) == false;
}