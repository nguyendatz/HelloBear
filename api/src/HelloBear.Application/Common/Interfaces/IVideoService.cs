using HelloBear.Application.Common.Models;
using Microsoft.AspNetCore.Http;

namespace HelloBear.Application.Common.Interfaces;

public interface IVideoService : IScopedService
{
    Task UploadVideo(IFormFile video, string title, Action<UploadVideoResponse> progressChanged, CancellationToken cancellationToken);
}