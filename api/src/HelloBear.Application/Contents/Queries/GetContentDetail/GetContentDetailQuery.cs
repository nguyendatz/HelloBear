using AutoMapper;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Contents.Queries.GetContentDetail;

public record ContentDetailResponse
{
    public int Id { get; set; }

    public int LessonId { get; set; }

    public int PageNumber { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string PageImage { get; set; } = string.Empty;

    public ContentType Type { get; set; }

    public string? YoutubeLink { get; set; }

    public string? WordwallNetLink { get; set; }

    public string HashUrl { get; set; } = string.Empty;

    public string QrCodePath { get; set; } = string.Empty; // Generated from HashUrl

    public string TextBookName { get; set; } = string.Empty;

    public string LessonName { get; set; } = string.Empty;
}

public record GetContentDetailQuery(int Id) : IRequest<OperationResult<ContentDetailResponse>>;

public class GetContentDetailQueryHandler : IRequestHandler<GetContentDetailQuery, OperationResult<ContentDetailResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly BlobStorageSettings _blobStorageSettings;

    public GetContentDetailQueryHandler(IApplicationDbContext dbContext, IMapper mapper, IOptions<BlobStorageSettings> blobStorageSettings)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _blobStorageSettings = blobStorageSettings.Value;
    }

    public async Task<OperationResult<ContentDetailResponse>> Handle(GetContentDetailQuery request, CancellationToken cancellationToken)
    {
        var contentEntity = await _dbContext.Contents
            .Include(l => l.Lesson)
            .ThenInclude(l => l.TextBook)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id.Equals(request.Id));

        if (contentEntity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(Content)} with Id:{request.Id}");
        }

        var contentDetailResponse = _mapper.Map<ContentDetailResponse>(contentEntity);

        if (!string.IsNullOrEmpty(contentDetailResponse.QrCodePath))
        {
            contentDetailResponse.QrCodePath = $"{_blobStorageSettings.BlobPath}/{_blobStorageSettings.BlobContainerName}{contentDetailResponse.QrCodePath}";
        }

        if (!string.IsNullOrEmpty(contentDetailResponse.PageImage))
        {
            contentDetailResponse.PageImage = $"{_blobStorageSettings.BlobPath}/{_blobStorageSettings.BlobContainerName}/{contentDetailResponse.PageImage}";
        }

        return OperationResult.Ok(contentDetailResponse);
    }
}