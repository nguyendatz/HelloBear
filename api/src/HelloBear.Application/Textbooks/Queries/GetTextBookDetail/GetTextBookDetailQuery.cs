using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.TextBooks.Queries.GetTextBookDetail;

public record GetTextBookDetailQuery(int Id) : PageQueryWithSearchTextBase, IRequest<TextBookDetailResponse?>;

public class TextBookDetailResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public string? Thumbnail { get; set; }
    public string? Description { get; set; }
}

public class GetTextbookDetailQueryHandler : IRequestHandler<GetTextBookDetailQuery, TextBookDetailResponse?>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly BlobStorageSettings _blobStorageSettings;

    public GetTextbookDetailQueryHandler(IApplicationDbContext context, IMapper mapper, IOptions<BlobStorageSettings> blobStorageSettings)
    {
        _context = context;
        _mapper = mapper;
        _blobStorageSettings = blobStorageSettings.Value;
    }

    public async Task<TextBookDetailResponse?> Handle(GetTextBookDetailQuery request, CancellationToken cancellationToken)
    {
        var entity = (await _context.TextBooks
            .Where(x => x.Id == request.Id)
            .ProjectToPaginatedListAsync<TextBook, TextBookDetailResponse>(request, _mapper.ConfigurationProvider, cancellationToken)
            ).Items.FirstOrDefault();

        if (entity != null && !string.IsNullOrEmpty(entity.Thumbnail))
        {
            entity.Thumbnail = $"{_blobStorageSettings.BlobPath}/{_blobStorageSettings.BlobContainerName}/{entity.Thumbnail}";
        }

        return entity;
    }
}