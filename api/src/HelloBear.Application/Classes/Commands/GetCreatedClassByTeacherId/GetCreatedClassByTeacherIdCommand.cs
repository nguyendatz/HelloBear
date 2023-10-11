using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using MediatR;

namespace HelloBear.Application.Classes.Commands.GenerateQrCode;

public record GetCreatedClassByTeacherIdCommand(string Id) : IRequest<OperationResult<int>>;

public class GetCreatedClassByTeacherIdCommandHandler : IRequestHandler<GetCreatedClassByTeacherIdCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetCreatedClassByTeacherIdCommandHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<OperationResult<int>> Handle(GetCreatedClassByTeacherIdCommand request, CancellationToken cancellationToken)
    {
        int numberOfClassesCreated = _dbContext.Classes.Where(c => c.MainTeacherId.Equals(request.Id)).Count();
        return OperationResult.Ok(numberOfClassesCreated);
    }
}
