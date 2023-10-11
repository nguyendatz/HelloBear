using AutoMapper;
using AutoMapper.QueryableExtensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Communities.Queries.GetMediaStatus;

public record GetMediaStatusResponse
{
    public StudentMediaStatus Status { get; set; }
    public long BytesSent { get; set; }
    public string? Exception { get; set; }
}

public record GetMediaStatusQuery(Guid RequestId) : IRequest<OperationResult<GetMediaStatusResponse>>;

public class GetMediaStatusQueryHandler : IRequestHandler<GetMediaStatusQuery, OperationResult<GetMediaStatusResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetMediaStatusQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<OperationResult<GetMediaStatusResponse>> Handle(GetMediaStatusQuery request, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.StudentMediaProcessings
            .Where(c => c.RequestId == request.RequestId)
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedDate)
            .ProjectTo<GetMediaStatusResponse>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}");
        }

        return OperationResult.Ok(entity);
    }
}