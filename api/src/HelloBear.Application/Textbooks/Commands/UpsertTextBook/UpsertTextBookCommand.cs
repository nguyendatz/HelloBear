using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.TextBooks.Commands.UpsertTextBook;

public record UpsertTextBookCommand : IRequest<OperationResult<int>>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public string? Description { get; set; }
}

public class UpsertTextbookCommandHandler : IRequestHandler<UpsertTextBookCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;
    private readonly IBlobService _blobService;

    public UpsertTextbookCommandHandler(IApplicationDbContext context, IBlobService blobService)
    {
        _context = context;
        _blobService = blobService;
    }

    public async Task<OperationResult<int>> Handle(UpsertTextBookCommand request, CancellationToken cancellationToken)
    {
        TextBook? textbook;

        if (request.Id == 0)
        {
            var existing = await _context.TextBooks.AnyAsync(x => x.ShortName == request.ShortName, cancellationToken);
            if (existing)
            {
                return OperationResult.BadRequest(AppConstants.ResponseCodeMessage.ShortNameExisted);
            }

            textbook = new TextBook();
            await _context.TextBooks.AddAsync(textbook, cancellationToken);
        }
        else
        {
            textbook = _context.TextBooks.FirstOrDefault(x => x.Id == request.Id);
            if (textbook == null)
            {
                return OperationResult.BadRequest(AppConstants.ResponseCodeMessage.RecordNotFound);
            }
        }

        if (textbook.Thumbnail != request.Thumbnail && !string.IsNullOrEmpty(textbook.Thumbnail))
        {
            await _blobService.DeleteFile(Path.GetFileName(textbook.Thumbnail), BlobFolder.TextBook);
        }

        textbook.Name = request.Name;
        textbook.ShortName = request.ShortName;
        textbook.Thumbnail = request.Thumbnail;
        textbook.Description = request.Description;

        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(textbook.Id);
    }
}
