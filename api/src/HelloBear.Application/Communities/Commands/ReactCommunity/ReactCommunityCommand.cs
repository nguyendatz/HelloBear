using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;

namespace HelloBear.Application.Communities.Commands.ReactCommunity;

public record ReactCommunityCommand(int Id, ReactionType Type) : IRequest<OperationResult<int>>;

internal class ReactCommunityCommandHandler : IRequestHandler<ReactCommunityCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;

    public ReactCommunityCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult<int>> Handle(ReactCommunityCommand request, CancellationToken cancellationToken)
    {
        var studentMedia = await _context.StudentMedias.FindAsync(request.Id, cancellationToken);

        if (studentMedia is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(StudentMedia)} with Id:{request.Id}");
        }

        if (request.Type == ReactionType.Like)
        {
            studentMedia.LikeNumber++;
        }
        else if (request.Type == ReactionType.Heart)
        {
            studentMedia.HeartNumber++;
        }

        var result = await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(result);
    }
}