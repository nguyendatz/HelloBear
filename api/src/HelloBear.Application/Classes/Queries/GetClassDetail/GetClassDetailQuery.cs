using AutoMapper;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Classes.Queries.GetClassDetail;

public record GetClassDetailQuery(int Id) : IRequest<OperationResult<ClassDetailResponse>>;

public class ClassDetailResponse
{
    public int Id { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int TextBookId { get; set; }
    public string? MainTeacherId { get; set; }
    public string? MainTeacherFullName { get; set; }
    public TextBookLevel TextBookLevel { get; set; }
    public string ClassCode { get; set; } = string.Empty;
    public string HashUrl { get; set; } = string.Empty;
    public string QrCodePath { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ClassStatus Status { get; set; }
    public IList<string> SecondaryTeacherIds { get; set; } = new List<string>();
}

public class GetClassDetailCommandHandler : IRequestHandler<GetClassDetailQuery, OperationResult<ClassDetailResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly BlobStorageSettings _blobStorageSettings;

    public GetClassDetailCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IOptions<BlobStorageSettings> blobStorageSettings)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _blobStorageSettings = blobStorageSettings.Value;
    }

    public async Task<OperationResult<ClassDetailResponse>> Handle(GetClassDetailQuery request, CancellationToken cancellationToken)
    {
        var classEntity = await _dbContext.Classes.Include(c => c.SecondaryTeachers)
            .Include(c => c.MainTeacher)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id.Equals(request.Id));
        if (classEntity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The resource you have requested cannot be found");
        }

        var classDetailResponse = _mapper.Map<ClassDetailResponse>(classEntity);

        if (!string.IsNullOrEmpty(classDetailResponse.QrCodePath))
        {
            classDetailResponse.QrCodePath = $"{_blobStorageSettings.BlobPath}/{_blobStorageSettings.BlobContainerName}{classDetailResponse.QrCodePath}";
        }

        return OperationResult.Ok(classDetailResponse);
    }
}