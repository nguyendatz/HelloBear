using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.Units.Queries.GetUnitsWithPagination;

public record UnitResponse
{
    public int Id { get; set; }
    public int Order { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public record GetUnitsWithPaginationQuery(int TextbookId) : PageQueryWithSearchTextBase, IRequest<PaginatedList<UnitResponse>>;

public class GetUnitsWithPaginationQueryHandler : IRequestHandler<GetUnitsWithPaginationQuery, PaginatedList<UnitResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetUnitsWithPaginationQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<PaginatedList<UnitResponse>> Handle(GetUnitsWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = _dbContext.Lessons
            .Where(x => x.TextBookId == request.TextbookId);

        if (!string.IsNullOrEmpty(request.SearchText))
        {
            query = query.Where(x => x.Name.Contains(request.SearchText)
                || x.Number.Contains(request.SearchText)
                || x.Description != null && x.Description.Contains(request.SearchText));
        }

        return await query.ProjectToPaginatedListAsync<Lesson, UnitResponse>(request, _mapper.ConfigurationProvider, cancellationToken);
    }
}