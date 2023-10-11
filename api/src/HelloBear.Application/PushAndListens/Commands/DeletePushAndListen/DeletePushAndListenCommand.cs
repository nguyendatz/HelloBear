using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.PushAndListens.Commands.DeletePushAndListen;

public record DeletePushAndListenCommand(int Id) : IRequest<OperationResult>;

public class DeletePushAndListenCommandHandler : IRequestHandler<DeletePushAndListenCommand, OperationResult>
{
    private readonly IApplicationDbContext _context;

    public DeletePushAndListenCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult> Handle(DeletePushAndListenCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.PushAndListen.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

        if (entity == null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(PushAndListen)} with Id:{request.Id}");
        }

        _context.PushAndListen.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.NoContent();
    }
}
