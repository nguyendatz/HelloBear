using AutoMapper;
using AutoMapper.QueryableExtensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.PushAndListens.Queries;

public record GetPushAndListenQuery(int ContentId) : IRequest<OperationResult<List<PushAndListenResponse>>>;

public class PushAndListenResponse
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

public class GetPushAndListenQueryHandler : IRequestHandler<GetPushAndListenQuery, OperationResult<List<PushAndListenResponse>>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetPushAndListenQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<OperationResult<List<PushAndListenResponse>>> Handle(GetPushAndListenQuery request, CancellationToken cancellationToken)
    {
        var list = await _dbContext.PushAndListen
            .Where(x => x.ContentId == request.ContentId)
            .AsNoTracking()
            .ProjectTo<PushAndListenResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return OperationResult.Ok(list);
    }
}