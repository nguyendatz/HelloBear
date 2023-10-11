using AutoMapper;
using AutoMapper.QueryableExtensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Students.Commands;

public record GetStudentPushAndListenCommand(int ContentId) : IRequest<OperationResult<List<StudentPushAndListenResponse>>>;

public class StudentPushAndListenResponse
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

public class GetStudentPushAndListenCommandHandler : IRequestHandler<GetStudentPushAndListenCommand, OperationResult<List<StudentPushAndListenResponse>>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetStudentPushAndListenCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<OperationResult<List<StudentPushAndListenResponse>>> Handle(GetStudentPushAndListenCommand request, CancellationToken cancellationToken)
    {
        var list = await _dbContext.PushAndListen
            .Where(x => x.ContentId == request.ContentId)
            .AsNoTracking()
            .ProjectTo<StudentPushAndListenResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return OperationResult.Ok(list);
    }
}