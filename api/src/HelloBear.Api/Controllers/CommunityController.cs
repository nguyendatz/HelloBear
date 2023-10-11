using HelloBear.Api.Attributes;
using HelloBear.Application.Communities.Commands.DeleteCommunity;
using HelloBear.Application.Communities.Commands.ReactCommunity;
using HelloBear.Application.Communities.Commands.UploadImage;
using HelloBear.Application.Communities.Commands.UploadVideo;
using HelloBear.Application.Communities.Queries.GetCommunities;
using HelloBear.Application.Communities.Queries.GetMediaStatus;
using HelloBear.Application.Settings;
using HelloBear.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HelloBear.Api.Controllers;

public class CommunityController : ApiControllerBase
{
    [HttpGet]
    public Task<ActionResult<List<CommunityResponse>>> GetCommunities([FromQuery] GetCommunitiesQuery query) => HandleRequest(query);

    [HttpPut("{id}/{type}")]
    public Task<ActionResult<int>> ReactCommunity(int id, ReactionType type)
        => HandleRequest(new ReactCommunityCommand(id, type));

    [HttpDelete("{id}")]
    [Authorize]
    [ValidateUserRole(AppConstants.AdminRole, AppConstants.TeacherRole)]
    public Task<IActionResult> DeleteCommunity(int id)
        => HandleRequest(new DeleteCommunityCommand(id));

    [HttpPost("upload-image")]
    public Task<ActionResult<string>> UploadImage([FromForm]UploadImageCommand command)
        => HandleRequest(command);

    [HttpPost("upload-video")]
    public Task<ActionResult<Guid>> UploadVideo([FromForm]UploadVideoCommand command)
        => HandleRequest(command);

    [HttpGet("media-status")]
    public Task<ActionResult<GetMediaStatusResponse>> GetMediaStatus([FromQuery] GetMediaStatusQuery query)
        => HandleRequest(query);
}