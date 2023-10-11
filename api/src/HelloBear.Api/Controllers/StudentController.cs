using HelloBear.Api.Attributes;
using HelloBear.Application.Contents.Queries.GetContentDetail;
using HelloBear.Application.Lessons.Commands.CreateLesson;
using HelloBear.Application.Lessons.Commands.UpdateLesson;
using HelloBear.Application.Lessons.Queries.GetLessonDetail;
using HelloBear.Application.Lessons.Shared.Models;
using HelloBear.Application.Settings;
using HelloBear.Application.Students.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

public class StudentController : ApiControllerBase
{

    [HttpPost]
    public Task<ActionResult<StudentProfile>> Create(CreateStudentCommand command)
        => HandleRequest(command);

    [HttpGet("content/{id}")]
    public Task<ActionResult<StudentContentDetailResponse>> GetContentDetail(int id)
        => HandleRequest(new GetStudentContentCommand(id));

    [HttpGet("push-listen/{id}")]
    public Task<ActionResult<List<StudentPushAndListenResponse>>> GetPushAndListen(int id)
        => HandleRequest(new GetStudentPushAndListenCommand(id));

    [HttpGet("class-hash-code/{id}")]
    public Task<ActionResult<string>> GetClassHashCodeByContentId(int id)
        => HandleRequest(new GetClassHashCodeByContentIdCommand(id));
    [HttpGet("class-status")]
    public Task<ActionResult<bool>> CheckClassIsCompleted(string hashCode)
        => HandleRequest(new CheckClassIsCompletedCommand(hashCode));
}