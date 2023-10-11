using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace HelloBear.Application.TextBooks.Commands.UploadThumbnail;

public record UploadThumbnailCommand(IFormFile File) : IRequest<OperationResult<string>>;

public class UploadThumbnailCommandHandler : IRequestHandler<UploadThumbnailCommand, OperationResult<string>>
{
    private readonly IBlobService _blobService;

    public UploadThumbnailCommandHandler(IBlobService blobService)
    {
        _blobService = blobService;
    }

    public async Task<OperationResult<string>> Handle(UploadThumbnailCommand request, CancellationToken cancellationToken)
    {
        var path = await _blobService.UploadFile(request.File, BlobFolder.TextBook);
        return OperationResult.Ok(path);
    }
}