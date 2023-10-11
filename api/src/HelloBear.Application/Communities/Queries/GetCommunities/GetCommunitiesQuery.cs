using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Communities.Queries.GetCommunities;

public record CommunityResponse
{
    public int Id { get; set; }

    public int ClassId { get; set; }

    public int LessonId { get; set; }

    public int StudentId { get; set; }

    public string Url { get; set; } = string.Empty;

    public string Thumbnail { get; set; } = string.Empty;

    public MediaType Type { get; set; }

    public int LikeNumber { get; set; }

    public int HeartNumber { get; set; }

    public string StudentName { get; set; } = string.Empty;
}

public record GetCommunitiesQuery : IRequest<List<CommunityResponse>>
{
    public int LessonId { get; set; }
    public int ClassId { get; set; }
}

public class GetCommunitiesQueryHandler : IRequestHandler<GetCommunitiesQuery, List<CommunityResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCommunitiesQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<CommunityResponse>> Handle(GetCommunitiesQuery request, CancellationToken cancellationToken)
    {
        var query = from c in _dbContext.StudentMedias
                    where c.ClassId == request.ClassId
                    join s in _dbContext.Students
                    on c.StudentId equals s.Id
                    select new CommunityResponse
                    {
                        Id = c.Id,
                        ClassId = c.ClassId,
                        LessonId = c.LessonId,
                        StudentId = c.StudentId,
                        Url = c.Url,
                        Type = c.Type,
                        HeartNumber = c.HeartNumber,
                        LikeNumber = c.LikeNumber,
                        Thumbnail = c.Thumbnail ?? string.Empty,
                        StudentName = s.Name
                    };
        if (request.LessonId > 0)
        {
            query = query.Where(c => c.LessonId == request.LessonId);
        }

        return await query.ToListAsync();
    }
}