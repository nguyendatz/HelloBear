using AutoMapper;
using HashidsNet;
using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace HelloBear.Application.Students.Commands;

public record CheckClassIsCompletedCommand(string ClassHashCode) : IRequest<OperationResult<bool>>;

public class CheckClassStatusCommandHandler : IRequestHandler<CheckClassIsCompletedCommand, OperationResult<bool>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClassService _classSevices;

    public CheckClassStatusCommandHandler(IApplicationDbContext dbContext, IClassService classSevices)
    {
        _dbContext = dbContext;
        _classSevices = classSevices;
    }

    public async Task<OperationResult<bool>> Handle(CheckClassIsCompletedCommand request, CancellationToken cancellationToken)
    {

        var classId = await _classSevices.DecodeClassHashCode(request.ClassHashCode);

        var classEntity = await _dbContext.Classes
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.Id.Equals(classId));

        if (classEntity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The resource you have requested cannot be found");
        }
        DateTime currentTime = DateTime.UtcNow;
        bool isClassCompleted = classEntity.EndDate <= currentTime;
        return OperationResult.Ok(isClassCompleted);
    }
}