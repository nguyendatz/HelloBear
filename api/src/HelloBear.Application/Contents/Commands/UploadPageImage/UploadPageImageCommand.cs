using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace HelloBear.Application.Contents.Commands.UploadFile;
public record UploadPageImageCommand(IFormFile File) : IRequest<OperationResult<string>>;

public class UploadPageImageCommandHandler : IRequestHandler<UploadPageImageCommand, OperationResult<string>>
{
    private readonly IBlobService _blobService;

    public UploadPageImageCommandHandler(IBlobService blobService)
    {
        _blobService = blobService;
    }

    public async Task<OperationResult<string>> Handle(UploadPageImageCommand request, CancellationToken cancellationToken)
    {
        var path = await _blobService.UploadFile(request.File, BlobFolder.Content);
        return OperationResult.Ok(path);
    }
}