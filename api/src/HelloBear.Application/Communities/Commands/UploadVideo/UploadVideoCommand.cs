using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace HelloBear.Application.Communities.Commands.UploadVideo;
public record UploadVideoCommand(int StudentId, int ClassId, int LessionId, string Title, IFormFile Video) : IRequest<OperationResult<Guid>>;

public class UploadVideoCommandHandler : IRequestHandler<UploadVideoCommand, OperationResult<Guid>>
{
    private readonly IVideoService _videoService;
    private readonly IServiceProvider _serviceProvider;

    public UploadVideoCommandHandler(IVideoService videoService, IServiceProvider serviceProvider)
    {
        _videoService = videoService;
        _serviceProvider = serviceProvider;
    }

    public async Task<OperationResult<Guid>> Handle(UploadVideoCommand request, CancellationToken cancellationToken)
    {
        var requestId = Guid.NewGuid();

        await _videoService.UploadVideo(
            request.Video,
            request.Title,
            async (response) => await UploadProgressChanged(request, response, requestId),
            cancellationToken);

        return OperationResult.Ok(requestId);
    }

    private async Task UploadProgressChanged(UploadVideoCommand request, UploadVideoResponse response, Guid requestId)
    {
        using var source = new CancellationTokenSource();
        var cancellationToken = source.Token;

        // This function is can be triggered after the scope is closed so we need to create a new scope
        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

        await dbContext.StudentMediaProcessings.AddAsync(new StudentMediaProcessing
        {
            RequestId = requestId,
            BytesSent = response.BytesSent,
            Exception = response.Exception,
            Status = (StudentMediaStatus)response.Status
        }, cancellationToken);

        if (response.Status == UploadVideoStatus.Completed)
        {
            await dbContext.StudentMedias.AddAsync(new StudentMedia
            {
                ClassId = request.ClassId,
                LessonId = request.LessionId,
                StudentId = request.StudentId,
                Url = response.Link,
                Type = MediaType.Video
            });
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}