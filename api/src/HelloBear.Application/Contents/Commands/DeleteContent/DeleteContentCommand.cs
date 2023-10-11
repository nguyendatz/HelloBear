using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.Contents.Commands.DeleteContent;
public record DeleteContentCommand(int Id) : IRequest<OperationResult>;

public class DeleteContentCommandHandler : IRequestHandler<DeleteContentCommand, OperationResult>
{
    private readonly IApplicationDbContext _context;

    public DeleteContentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult> Handle(DeleteContentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Contents.FindAsync(request.Id, cancellationToken);

        if (entity is null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(TextBook)} with Id:{request.Id}");
        }

        // TODO: check Push And Listen is relating to

        _context.Contents.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.NoContent();
    }
}