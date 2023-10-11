using AutoMapper;
using AutoMapper.QueryableExtensions;
using HelloBear.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Lessons.Queries.GetLessonsByClass;

public record LessonsByClassResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Number { get; set; } = string.Empty;
    public int Order { get; set; }
}

public record GetLessonsByClassQuery(int ClassId) : IRequest<List<LessonsByClassResponse>>;

public class GetLessonsByClassQueryHandler : IRequestHandler<GetLessonsByClassQuery, List<LessonsByClassResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLessonsByClassQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public Task<List<LessonsByClassResponse>> Handle(GetLessonsByClassQuery request, CancellationToken cancellationToken)
    {
        var query = from l in _dbContext.Lessons
                    join c in _dbContext.Classes on l.TextBookId equals c.TextBookId
                    where c.Id == request.ClassId
                    select l;

        return query.AsNoTracking()
            .ProjectTo<LessonsByClassResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}