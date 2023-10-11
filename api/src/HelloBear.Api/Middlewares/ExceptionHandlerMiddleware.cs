using System.Net;
using System.Text;
using HelloBear.Application.Common.Exceptions;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Http.Extensions;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace HelloBear.Api.Middlewares;

public class ExceptionHandlerMiddleware
{
    private static readonly JsonSerializerSettings _jsonSettings = new()
    {
        Converters = new List<JsonConverter> { new StringEnumConverter() },
        ContractResolver = new CamelCasePropertyNamesContractResolver(),
        Formatting = Formatting.Indented
    };

    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlerMiddleware> _logger;

    public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
    {
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext httpContext, IWebHostEnvironment env)
    {
        try
        {
            await _next(httpContext);
        }
        catch (JsonException jsonException)
        {
            var message = jsonException.Message;

            switch (jsonException)
            {
                case JsonReaderException jsonReaderException:
                    message = string.IsNullOrEmpty(jsonReaderException.Path) ? jsonReaderException.Message : $"Failed to read value for {jsonReaderException.Path}.";
                    break;

                case JsonSerializationException jsonSerializationException:
                    message = string.IsNullOrEmpty(jsonSerializationException.Path) ? jsonSerializationException.Message : $"Failed to read value for {jsonSerializationException.Path}.";
                    break;
            }

            var operationResult = OperationResult.BadRequest(message);

            var response = JsonConvert.SerializeObject(operationResult.Status, _jsonSettings);

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)operationResult.Status.StatusCode;

            await httpContext.Response.WriteAsync(response);
        }
        catch (ValidationException validationException)
        {
            var message = validationException.Message;

            var operationResult = OperationResult.BadRequest($"{AppConstants.ResponseCodeMessage.ValidationFailed}", message);

            var responseContent = new
            {
                operationResult.Status.Title,
                StatusCode = (int)operationResult.Status.StatusCode,
                operationResult.Status.Detail,
                validationException.Errors
            };

            var response = JsonConvert.SerializeObject(responseContent, _jsonSettings);
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)operationResult.Status.StatusCode;

            await httpContext.Response.WriteAsync(response);
        }
        catch (TaskCanceledException cancelledException) when (cancelledException.InnerException is TimeoutException)
        {
            _logger.LogError(cancelledException, "Request time-out");

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;

            // Now return an error message to the user
            var message = new
            {
                Title = "Request time-out"
            };

            await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(message, _jsonSettings));
        }
        catch (Exception ex)
        {
            // record an ID so we can look up the error
            var id = Guid.NewGuid();

            var properties = new Dictionary<string, string>
                    {
                        { "ExceptionId", id.ToString() },
                        { "User", httpContext.User?.Identity?.Name ?? "Unknown" },
                        { "Request", httpContext.Request.GetEncodedUrl() },
                    };

            try
            {
                _logger.LogError(ex, $"Unhandled API exception ({JsonConvert.SerializeObject(properties, _jsonSettings)})");
            }
            catch (Exception)
            {
            }

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Now return an error message to the user
            var message = new
            {
                Title = env.IsDevelopment() ? new StringBuilder(ex.Message).AppendLine(ex.StackTrace).ToString() :
                "An unexpected error occurred" // Purposely do not expose the error to the user
            };

            await httpContext.Response.WriteAsync(JsonConvert.SerializeObject(message, _jsonSettings));
        }
    }
}