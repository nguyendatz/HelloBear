using HelloBear.Api.Attributes;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Contents.Commands.DeleteContent;
using HelloBear.Application.Contents.Queries;
using HelloBear.Application.Contents.Queries.ExportQrCodes;
using HelloBear.Application.Contents.Shared.Models;
using HelloBear.Application.Contents.Commands.CreateContent;
using HelloBear.Application.Contents.Commands.UpdateContent;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HelloBear.Application.Contents.Commands.UploadFile;
using HelloBear.Application.Contents.Queries.GetContentDetail;

namespace HelloBear.Api.Controllers;

[Authorize]
public class ContentController : ApiControllerBase
{
    [HttpGet]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<PaginatedList<ContentListResponse>>> GetContentsWithPagination([FromQuery] GetContentsWithPaginationQuery query)
        => HandleRequest(query);

    [HttpGet("{id}")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<ContentDetailResponse>> GetContentDetail(int id)
        => HandleRequest(new GetContentDetailQuery(id));

    [HttpPost]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> Create(ContentBodyRequest bodyRequest)
        => HandleRequest(new CreateContentCommand(bodyRequest));

    [HttpPut("{id}")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> Update(int id, ContentBodyRequest bodyRequest)
        => HandleRequest(new UpdateContentCommand(id, bodyRequest));

    [HttpDelete("{id}")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<IActionResult> Delete(int id)
       => HandleRequest(new DeleteContentCommand(id));

    [HttpPost("upload-page-image")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<string>> UploadPageImage(IFormFile file)
       => HandleRequest(new UploadPageImageCommand(file));

    [HttpGet("export-qrcode/{lessonId}")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public async Task<IActionResult> ExportQrCode(int lessonId)
    {
        var result = await Mediator.Send(new ExportQrCodesQuery(lessonId));

        if (!result.Succeeded)
        {
            return result.Status.HasDetails() ?
            new ObjectResult(result.Status) { StatusCode = (int)result.Status.StatusCode } :
            new StatusCodeResult((int)result.Status.StatusCode);
        }

        return File(result.Value.Content, result.Value.ContentType, result.Value.FileName);
    }
}