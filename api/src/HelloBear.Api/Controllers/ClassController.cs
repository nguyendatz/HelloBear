using HelloBear.Api.Attributes;
using HelloBear.Application.Classes.Commands.CreateClass;
using HelloBear.Application.Classes.Commands.GenerateQrCode;
using HelloBear.Application.Classes.Queries.GetClassDetail;
using HelloBear.Application.Classes.Queries.GetClassesWithPagination;
using HelloBear.Application.Classes.Shared.Models;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Lessons.Queries.GetLessonsByClass;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

[Authorize]
public class ClassController : ApiControllerBase
{
    [HttpGet]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<PaginatedList<ClassResponse>>> GetClassesWithPagination([FromQuery] GetClassesWithPaginationQuery query)
        => HandleRequest(query);

    [HttpGet("{id}")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<ClassDetailResponse>> GetClassById(int id)
        => HandleRequest(new GetClassDetailQuery(id));

    [HttpPost]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> Create(CreateClassCommand createClassCommand)
        => HandleRequest(createClassCommand);

    [HttpPut("{id}")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> Update(int id, ClassBodyRequest bodyRequest)
        => HandleRequest(new UpdateClassCommand(id, bodyRequest));

    [HttpPut("{id}/regenerate-qrcode")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> RegenerateQrCodeClass(int id)
        => HandleRequest(new RegenerateQrCodeClassCommand(id));

    [HttpGet("{id}/get-created-classes")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<int>> GetCreatedClassesByTeacherId(string id)
       => HandleRequest(new GetCreatedClassByTeacherIdCommand(id));

    [HttpGet("{id}/units")]
    [AllowAnonymous]
    public Task<ActionResult<List<LessonsByClassResponse>>> GetLessonsByClass(int id) => HandleRequest(new GetLessonsByClassQuery(id));
}