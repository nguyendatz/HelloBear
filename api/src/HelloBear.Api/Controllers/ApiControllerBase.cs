using System.ComponentModel.DataAnnotations;
using System.IO;
using Azure;
using HelloBear.Application.Common.Models;
using HelloBear.Application.Common.Models.OperationResults;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    private ISender? _mediator;

    protected ISender Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    protected async Task<ActionResult<TResponse>> HandleRequest<TResponse>(IRequest<OperationResult<TResponse>> request)
    {
        var result = await Mediator.Send(request);

        return ConvertToActionResult(result ?? throw new InvalidOperationException());
    }

    protected async Task<IActionResult> HandleRequest(IRequest<OperationResult> request)
    {
        var result = await Mediator.Send(request);
        
        return ConvertToActionResult(result ?? throw new InvalidOperationException());
    }

    protected async Task<ActionResult<TResponse>> HandleRequest<TResponse>(IRequest<TResponse> request)
    {
        var result = await Mediator.Send(request);

        return Ok(result ?? throw new InvalidOperationException());
    }

    protected ActionResult<TResponse> ConvertToActionResult<TResponse>(OperationResult<TResponse> result)
    {
        if (!result.Succeeded)
        {
            if (result.Status.StatusCode == OperationResultStatusCode.BadRequest)
            {
                var badRequestResult = result as BadRequestResult<TResponse>;

                if (badRequestResult?.ValidationResults?.Any() == true)
                {
                    AddModelError(badRequestResult.ValidationResults);

                    return ModelState.IsValid ?
                        BadRequest(badRequestResult?.ValidationResults.Select(x => x?.ErrorMessage)) :
                        BadRequest(ModelState);
                }
            }

            return GetErrorActionResult(result.Status);
        }

        if (result.Status.StatusCode == OperationResultStatusCode.Created)
        {
            var createdResult = result as CreatedResult<TResponse>;

            if (!string.IsNullOrWhiteSpace(createdResult?.Id))
            {
                var resource = GetResourcePath(createdResult.Id!);

                return Created(resource, createdResult.Value);
            }
        }

        if (result.Status.StatusCode == OperationResultStatusCode.Ok)
        {
            return result.Value is null ? Ok() : Ok(result.Value);
        }

        return result.Value is null ?
            new StatusCodeResult((int)result.Status.StatusCode) :
            new ObjectResult(result.Value)
            {
                StatusCode = (int)result.Status.StatusCode
            };
    }

    protected IActionResult ConvertToActionResult(OperationResult result)
    {
        if (!result.Succeeded)
        {
            if (result.Status.StatusCode == OperationResultStatusCode.BadRequest)
            {
                var badRequestResult = result as Application.Common.Models.OperationResults.BadRequestResult;

                if (badRequestResult?.ValidationResults?.Any() == true)
                {
                    AddModelError(badRequestResult.ValidationResults);

                    return BadRequest(ModelState);
                }
            }

            return GetErrorActionResult(result.Status);
        }

        return new StatusCodeResult((int)result.Status.StatusCode);
    }

    private void AddModelError(IEnumerable<ValidationResult> validationResults)
    {
        foreach (ValidationResult validationResult in validationResults)
        {
            IEnumerable<string> memberNames = validationResult.MemberNames ?? Enumerable.Empty<string>();

            foreach (string memberName in memberNames)
            {
                ModelState.AddModelError(memberName, validationResult?.ErrorMessage ?? string.Empty);
            }
        }
    }

    private static ActionResult GetErrorActionResult(OperationStatus status)
    {
        return status.HasDetails() ?
            new ObjectResult(status) { StatusCode = (int)status.StatusCode } :
            new StatusCodeResult((int)status.StatusCode);
    }

    private PathString GetResourcePath(object resource)
        => Request.Path.Add(PathString.FromUriComponent($"/{resource}"));
}
