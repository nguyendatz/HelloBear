using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.TextBooks.Commands.DeleteTextBook;

public record DeleteTextBookCommand(int Id) : IRequest<OperationResult>;

public class DeleteTextBookCommandHandler : IRequestHandler<DeleteTextBookCommand, OperationResult>
{
    private readonly IApplicationDbContext _context;
    private readonly IBlobService _blobService;

    public DeleteTextBookCommandHandler(IApplicationDbContext context, IBlobService blobService)
    {
        _context = context;
        _blobService = blobService;
    }

    public async Task<OperationResult> Handle(DeleteTextBookCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.TextBooks.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(TextBook)} with Id:{request.Id}");
        }

        if (_context.Classes.Any(c => c.TextBookId == entity.Id))
        {
            return OperationResult.BadRequest($"{AppConstants.ResponseCodeMessage.CantDeleteTextBookHasClasses}", $"{nameof(TextBook)} with Id:{request.Id} has classes.");
        }

        if (!string.IsNullOrEmpty(entity.Thumbnail))
        {
            await _blobService.DeleteFile(Path.GetFileName(entity.Thumbnail), BlobFolder.TextBook);
        }

        _context.TextBooks.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.NoContent();
    }

}
