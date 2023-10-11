using HelloBear.Api.Attributes;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Settings;
using HelloBear.Application.TextBooks.Commands.DeleteTextBook;
using HelloBear.Application.TextBooks.Commands.UploadThumbnail;
using HelloBear.Application.TextBooks.Commands.UpsertTextBook;
using HelloBear.Application.TextBooks.Queries.GetTextBookDetail;
using HelloBear.Application.TextBooks.Queries.GetTextbooksWithPagination;
using HelloBear.Application.Units.Queries.GetUnitsWithPagination;
using HelloBear.Application.Textbooks.Commands.GetAllTextBooks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

[Authorize]
public class TextBookController : ApiControllerBase
{
    [HttpGet]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<PaginatedList<TextBookQueryResponse>>> GetTextBooksWithPagination([FromQuery] GetTextBooksWithPaginationQuery query)
        => HandleRequest(query);

    [HttpGet("{Id}")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<TextBookDetailResponse?>> GetTextbookDetail([FromRoute] GetTextBookDetailQuery query)
        => HandleRequest(query);

    [HttpPost]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<int>> Save(UpsertTextBookCommand command)
        => HandleRequest(command);

    [HttpGet("unit")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<PaginatedList<UnitResponse>>> GetUnitsWithPagination([FromQuery] GetUnitsWithPaginationQuery query)
        => HandleRequest(query);

    [HttpPost("upload-thumbnail")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<string>> UploadThumbnail(IFormFile file)
        => HandleRequest(new UploadThumbnailCommand(file));

    [HttpDelete("{id}")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<IActionResult> Delete(int id)
        => HandleRequest(new DeleteTextBookCommand(id));

    [HttpGet("all")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<List<TextBookQueryResponse>>> GetAllTextBooks()
        => HandleRequest(new GetAllTextBooksCommand());
}
