using FluentEmail.Core;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Settings;
using MediatR;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.TextBooks.Queries.GetTextbooksWithPagination;

public record TextBookQueryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public bool HasClasses { get; set; }
}
public record GetTextBooksWithPaginationQuery : PageQueryWithSearchTextBase, IRequest<PaginatedList<TextBookQueryResponse>>
{
}

public class GetTextBooksWithPaginationQueryHandler : IRequestHandler<GetTextBooksWithPaginationQuery, PaginatedList<TextBookQueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly BlobStorageSettings _blobStorageSettings;

    public GetTextBooksWithPaginationQueryHandler(IApplicationDbContext dbContext, IOptions<BlobStorageSettings> blobStorageSettings)
    {
        _dbContext = dbContext;
        _blobStorageSettings = blobStorageSettings.Value;
    }

    public async Task<PaginatedList<TextBookQueryResponse>> Handle(GetTextBooksWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = from t in _dbContext.TextBooks
                    join c in _dbContext.Classes.DefaultIfEmpty()
                    on t.Id equals c.TextBookId into ClassOfTextBook
                    select new TextBookQueryResponse
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Description = t.Description ?? string.Empty,
                        ShortName = t.ShortName,
                        Thumbnail = t.Thumbnail ?? string.Empty,
                        HasClasses = ClassOfTextBook.Any()
                    };
        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            query = query.Where(t => t.Name.Contains(request.SearchText) || t.Description.Contains(request.SearchText));
        }

        var result = await query.ToPaginatedListAsync(request, cancellationToken);
        result.Items.ForEach(x =>
        {
            if (!string.IsNullOrEmpty(x.Thumbnail))
            {
                x.Thumbnail = $"{_blobStorageSettings.BlobPath}/{_blobStorageSettings.BlobContainerName}/{x.Thumbnail}";
            }
        });

        return result;
    }
}