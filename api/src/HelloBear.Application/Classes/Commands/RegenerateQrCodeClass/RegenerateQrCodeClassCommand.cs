using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using MediatR;

namespace HelloBear.Application.Classes.Commands.GenerateQrCode;

public record RegenerateQrCodeClassCommand(int Id) : IRequest<OperationResult<int>>;

public class RegenerateQrCodeClassCommandHandler : IRequestHandler<RegenerateQrCodeClassCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClassService _classSevices;

    public RegenerateQrCodeClassCommandHandler(IApplicationDbContext dbContext, IClassService classSevices)
    {
        _dbContext = dbContext;
        _classSevices = classSevices;
    }

    public async Task<OperationResult<int>> Handle(RegenerateQrCodeClassCommand request, CancellationToken cancellationToken)
    {
        var classEntity = await _dbContext.Classes.FindAsync(request.Id);

        if (classEntity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The resource you have requested cannot be found");
        }

        classEntity = await _classSevices.GenerateQrCode(classEntity);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(classEntity.Id);
    }
}
