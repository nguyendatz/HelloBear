namespace HelloBear.Application.Common.Models.OperationResults;

public enum OperationResultStatusCode
{
    Ok = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Error = 500,
    Unavailable = 503,
}