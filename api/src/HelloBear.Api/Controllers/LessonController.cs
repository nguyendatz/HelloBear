using HelloBear.Api.Attributes;
using HelloBear.Application.Lessons.Commands.CreateLesson;
using HelloBear.Application.Lessons.Commands.UpdateLesson;
using HelloBear.Application.Lessons.Queries.GetLessonDetail;
using HelloBear.Application.Lessons.Shared.Models;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

[Authorize]
public class LessonController : ApiControllerBase
{
    [HttpGet("{id}")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<LessonDetailResponse>> GetLessonById(int id)
        => HandleRequest(new GetLessonDetailQuery(id));

    [HttpPost]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> Create(LessonBodyRequest bodyRequest)
        => HandleRequest(new CreateLessonCommand(bodyRequest));

    [HttpPut("{id}")]
    [ValidateUserRole(AppConstants.AdminRole)]
    public Task<ActionResult<int>> Update(int id, LessonBodyRequest bodyRequest)
        => HandleRequest(new UpdateLessonCommand(id, bodyRequest));
}