using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace HelloBear.Application.Communities.Commands.UploadImage;
public record UploadImageCommand(int StudentId, int ClassId, int LessionId, IFormFile Image, IFormFile Thumbnail) : IRequest<OperationResult<string>>;

public class UploadImageCommandHandler : IRequestHandler<UploadImageCommand, OperationResult<string>>
{
    private readonly IBlobService _blobService;
    private readonly IApplicationDbContext _dbContext;

    public UploadImageCommandHandler(IBlobService blobService, IApplicationDbContext dbContext)
    {
        _blobService = blobService;
        _dbContext = dbContext;
    }

    public async Task<OperationResult<string>> Handle(UploadImageCommand request, CancellationToken cancellationToken)
    {
        var image = await _blobService.UploadFile(request.Image, BlobFolder.Content);
        var thumbnail = await _blobService.UploadFile(request.Thumbnail, BlobFolder.Content);

        await _dbContext.StudentMedias.AddAsync(new StudentMedia
        {
            ClassId = request.ClassId,
            LessonId = request.LessionId,
            StudentId = request.StudentId,
            Url = image,
            Thumbnail = thumbnail,
            Type = MediaType.Picture
        }, cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
        return OperationResult.Ok(image);
    }
}