using AutoMapper;
using HashidsNet;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Students.Commands;

public record GetClassHashCodeByContentIdCommand(int Id) : IRequest<OperationResult<string>>;

public class GetClassHashCodeByContentIdCommandHandler : IRequestHandler<GetClassHashCodeByContentIdCommand, OperationResult<string>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly BlobStorageSettings _blobStorageSettings;
    private readonly SystemSetting _systemSetting;

    public GetClassHashCodeByContentIdCommandHandler(IApplicationDbContext dbContext, IMapper mapper, IOptions<BlobStorageSettings> blobStorageSettings, IOptions<SystemSetting> systemSetting)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _blobStorageSettings = blobStorageSettings.Value;
        _systemSetting = systemSetting.Value;
    }

    public async Task<OperationResult<string>> Handle(GetClassHashCodeByContentIdCommand request, CancellationToken cancellationToken)
    {
        var contentEntity = await _dbContext.Contents
            .Include(l => l.Lesson)
            .ThenInclude(l => l.TextBook)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id.Equals(request.Id));
        if (contentEntity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The resource you have requested cannot be found");
        }

        var classId = await _dbContext.Classes.Where(c => c.TextBookId.Equals(contentEntity.Lesson.TextBookId)).Select(c => c.Id).FirstOrDefaultAsync();
        var hashids = new Hashids(_systemSetting.Salt, AppConstants.HashLength);
        string hashCode = hashids.Encode(classId);

        return OperationResult.Ok(hashCode);
    }
}