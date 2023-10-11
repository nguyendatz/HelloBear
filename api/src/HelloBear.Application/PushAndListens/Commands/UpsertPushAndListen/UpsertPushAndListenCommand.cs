using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.PushAndListens.Commands.UpsertPushAndListen;

public record UpsertPushAndListenCommand : IRequest<OperationResult<int>>
{
    public int Id { get; set; }
    public int ContentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AudioFileUrl { get; set; } = string.Empty;
    public int StartX { get; set; }
    public int StartY { get; set; }
    public int EndX { get; set; }
    public int EndY { get; set; }
    public int OriginalWidth { get; set; }
    public int OriginalHeight { get; set; }
}

public class UpsertPushAndListenCommandHandler : IRequestHandler<UpsertPushAndListenCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;

    public UpsertPushAndListenCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult<int>> Handle(UpsertPushAndListenCommand request, CancellationToken cancellationToken)
    {
        PushAndListen? entity;

        if (request.Id == 0)
        {
            entity = new PushAndListen();
            await _context.PushAndListen.AddAsync(entity, cancellationToken);
        }
        else
        {
            entity = _context.PushAndListen.FirstOrDefault(x => x.Id == request.Id);
            if (entity == null)
            {
                return OperationResult.BadRequest(AppConstants.ResponseCodeMessage.RecordNotFound);
            }
        }
        entity.Name = request.Name;
        entity.AudioFileUrl = request.AudioFileUrl;
        entity.StartX = request.StartX;
        entity.StartY = request.StartY;
        entity.EndX = request.EndX;
        entity.EndY = request.EndY;
        entity.OriginalWidth = request.OriginalWidth;
        entity.OriginalHeight = request.OriginalHeight;
        entity.ContentId = request.ContentId;

        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(entity.Id);
    }
}
