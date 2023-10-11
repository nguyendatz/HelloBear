using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.Communities.Commands.DeleteCommunity;

public record DeleteCommunityCommand(int Id) : IRequest<OperationResult>;

public record DeleteCommunityCommandHandler : IRequestHandler<DeleteCommunityCommand, OperationResult>
{
    private readonly IApplicationDbContext _context;

    public DeleteCommunityCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult> Handle(DeleteCommunityCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.StudentMedias.FindAsync(request.Id, cancellationToken);

        if (entity is null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(StudentMedia)} with Id:{request.Id}");
        }

        _context.StudentMedias.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.NoContent();
    }
}