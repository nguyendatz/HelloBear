using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;

namespace HelloBear.Application.Contents.Queries;

public record ContentListResponse
{
    public int Id { get; set; }

    public int LessonId { get; set; }

    public int PageNumber { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ContentType Type { get; set; }
}

public record GetContentsWithPaginationQuery : PageQueryWithSearchTextBase, IRequest<PaginatedList<ContentListResponse>>
{
    public int LessonId { get; set; }
}

public class GetContentsWithPaginationQueryHandler : IRequestHandler<GetContentsWithPaginationQuery, PaginatedList<ContentListResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetContentsWithPaginationQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedList<ContentListResponse>> Handle(GetContentsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Contents.Select(c => c);
        
        if (request.LessonId > 0)
        {
            query = query.Where(c => c.LessonId == request.LessonId);
        }

        if (!string.IsNullOrEmpty(request.SearchText))
        {
            int.TryParse(request.SearchText, out int pageNumber);
            query = query.Where(x => x.Name.Contains(request.SearchText) || (pageNumber > 0 && x.PageNumber == pageNumber));
        }

        PaginatedList<ContentListResponse> result = await query.ProjectToPaginatedListAsync<Content, ContentListResponse>(request, _mapper.ConfigurationProvider, cancellationToken);

        return result;
    }
}