using AutoMapper;
using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Students.Commands;

public record StudentContentDetailResponse
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
    public string ClassHashCode { get; set; } = string.Empty;
}

public record GetStudentContentCommand(int Id) : IRequest<OperationResult<StudentContentDetailResponse>>;

public class GetStudentContentCommandHandler : IRequestHandler<GetStudentContentCommand, OperationResult<StudentContentDetailResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly BlobStorageSettings _blobStorageSettings;
    private readonly IClassService _classSevices;


    public GetStudentContentCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IOptions<BlobStorageSettings> blobStorageSettings, IClassService classService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _blobStorageSettings = blobStorageSettings.Value;
        _classSevices = classService;
    }

    public async Task<OperationResult<StudentContentDetailResponse>> Handle(GetStudentContentCommand request, CancellationToken cancellationToken)
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
        var entityClass = await _dbContext.Classes.FirstOrDefaultAsync(c => c.TextBookId.Equals(contentEntity.Lesson.TextBookId));
        var contentDetailResponse = _mapper.Map<StudentContentDetailResponse>(contentEntity);

        string hashCode = await _classSevices.EncodeClassHashCode(entityClass.Id);
        contentDetailResponse.ClassHashCode = hashCode;

        if (!string.IsNullOrEmpty(contentDetailResponse.QrCodePath))
        {
            contentDetailResponse.QrCodePath = $"{_blobStorageSettings.BlobPath}/{_blobStorageSettings.BlobContainerName}{contentDetailResponse.QrCodePath}";
        }

        return OperationResult.Ok(contentDetailResponse);
    }
}