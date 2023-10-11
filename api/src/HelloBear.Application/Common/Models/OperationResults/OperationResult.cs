using System.ComponentModel.DataAnnotations;

namespace HelloBear.Application.Common.Models.OperationResults;

public record OperationResult
{
    public OperationResult(OperationStatus status) => Status = status;

    public OperationResult(OperationResultStatusCode statusCode) => Status = new OperationStatus(statusCode);

    public OperationResult(OperationResultStatusCode statusCode, string? title, string? detail) => Status = new OperationStatus(statusCode, title, detail);

    public OperationStatus Status { get; set; }

    public bool Succeeded => (int)Status.StatusCode >= 200 && (int)Status.StatusCode < 300;

    #region Static methods for failure results

    public static BadRequestResult BadRequest() => new BadRequestResult();

    public static BadRequestResult BadRequest(string title, string? detail = null) => new BadRequestResult(title, detail);

    public static BadRequestResult<TValue> BadRequest<TValue>(IEnumerable<ValidationResult?> validationResults) => new BadRequestResult<TValue>(validationResults);

    public static BadRequestResult DuplicateRecord(string entityName, string propertyName, string start = "A") => new BadRequestResult("Duplicate record", $"{start} {entityName} with the same {propertyName} already exists");

    public static NotFoundResult NotFound() => new NotFoundResult();

    public static NotFoundResult NotFound(string title, string? detail = null) => new NotFoundResult(title, detail);

    public static NotFoundResult NotFoundWithEntityName(string entityName) => new NotFoundResult("Record not found", $"The {entityName} you requested cannot be found.");

    public static ForbiddenResult Forbidden() => new ForbiddenResult();

    public static ForbiddenResult Forbidden(string title, string? detail = null) => new ForbiddenResult(title, detail);

    public static UnauthorizedResult Unauthorized() => new UnauthorizedResult();

    public static UnauthorizedResult Unauthorized(string title, string? detail = null) => new UnauthorizedResult(title, detail);

    public static ErrorResult Error() => new ErrorResult();

    public static ErrorResult Error(string title, string? detail = null) => new ErrorResult(title, detail);

    public static ErrorResult Error(Exception ex) => new ErrorResult("An error occurred", ex.Message);

    public static ErrorResult Error(Exception ex, string title) => new ErrorResult(title, ex.Message);

    public static UnavailableResult Unavailable() => new UnavailableResult();

    public static UnavailableResult Unavailable(string title, string? detail = null) => new UnavailableResult(title, detail);

    #endregion Static methods for failure results

    #region Static methods for successful results

    public static NoContentResult Ok() => new NoContentResult();

    public static OkResult<TValue> Ok<TValue>(TValue value) => new OkResult<TValue>(value);

    public static NoContentResult NoContent() => new NoContentResult();

    public static CreatedResult<TValue> Created<TValue>(TValue value) => new CreatedResult<TValue>(value);

    public static CreatedResult<TValue> Created<TValue>(Guid id, TValue value) => new CreatedResult<TValue>(id, value);

    public static CreatedResult<TValue> Created<TValue>(int id, TValue value) => new CreatedResult<TValue>(id, value);

    public static AcceptedResult Accepted() => new AcceptedResult();

    public static AcceptedResult<TValue> Accepted<TValue>(TValue value) => new AcceptedResult<TValue>(value);

    #endregion Static methods for successful results
}