using HelloBear.Api.Attributes;
using HelloBear.Application.PushAndListens.Commands.DeletePushAndListen;
using HelloBear.Application.PushAndListens.Commands.UpsertPushAndListen;
using HelloBear.Application.PushAndListens.Queries;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

[Authorize]
public class PushAndListenController : ApiControllerBase
{
    [HttpGet]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<List<PushAndListenResponse>>> Get([FromQuery] GetPushAndListenQuery query)
        => HandleRequest(query);

    [HttpPost]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<ActionResult<int>> Save(UpsertPushAndListenCommand command)
        => HandleRequest(command);

    [HttpDelete("{id}")]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<IActionResult> Delete(int id)
        => HandleRequest(new DeletePushAndListenCommand(id));
}