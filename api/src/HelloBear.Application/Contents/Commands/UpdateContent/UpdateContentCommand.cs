using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Contents.Shared.Models;
using HelloBear.Application.Contents.Shared.Services;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Contents.Commands.UpdateContent;
public record UpdateContentCommand(int Id, ContentBodyRequest BodyRequest) : IRequest<OperationResult<int>>;

public class UpdateContentCommandHandler : IRequestHandler<UpdateContentCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;
    private readonly IContentService _contentService;
    private readonly IBlobService _blobService;

    public UpdateContentCommandHandler(IApplicationDbContext context, IContentService contentService, IBlobService blobService)
    {
        _context = context;
        _contentService = contentService;
        _blobService = blobService;
    }

    public async Task<OperationResult<int>> Handle(UpdateContentCommand request, CancellationToken cancellationToken)
    {
        var content = await _context.Contents.FindAsync(request.Id);
        if (content is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(Content)} with Id:{request.Id}");
        }

        var lesson = await _context.Lessons.Include(l => l.TextBook)
            .FirstOrDefaultAsync(l => l.Id == request.BodyRequest.LessonId);
        if (lesson is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(Lesson)} with Id:{request.BodyRequest.LessonId}");
        }

        if (content.PageImage != request.BodyRequest.PageImage && !string.IsNullOrEmpty(content.PageImage))
        {
            await _blobService.DeleteFile(Path.GetFileName(content.PageImage), BlobFolder.Content);
        }

        content.PageNumber = request.BodyRequest.PageNumber;
        content.Name = request.BodyRequest.Name;
        content.Description = request.BodyRequest.Description;
        content.PageImage = request.BodyRequest.PageImage;
        content.Type = request.BodyRequest.Type;
        content.YoutubeLink = request.BodyRequest.YoutubeLink;
        content.WordwallNetLink = request.BodyRequest.WordwallNetLink;

        if (string.IsNullOrEmpty(content.QrCodePath))
        {
            await _contentService.GenerateQrCode(content, lesson.TextBook.ShortName);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(content.Id);
    }
}