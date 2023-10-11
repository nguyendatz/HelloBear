using HelloBear.Application.Classes.Shared.Models;
using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.Classes.Commands.CreateClass;

public record CreateClassCommand(ClassBodyRequest BodyRequest) : IRequest<OperationResult<int>>;

public class CreateClassCommandHandler : IRequestHandler<CreateClassCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;
    private readonly IClassService _classSevices;

    public CreateClassCommandHandler(IApplicationDbContext context, IClassService classSevices)
    {
        _context = context;
        _classSevices = classSevices;
    }

    public async Task<OperationResult<int>> Handle(CreateClassCommand request, CancellationToken cancellationToken)
    {
        var numberCreatedClass = _context.Classes.Where(c => c.MainTeacherId.Equals(request.BodyRequest.MainTeacherId)).Count();
        Class entity = new Class()
        {
            ClassCode = $"{request.BodyRequest.TextBookShortName}-{request.BodyRequest.MainTeacherShortName}-{(numberCreatedClass + 1).ToString("D3")}",
            ClassName = request.BodyRequest.ClassName,
            MainTeacherId = request.BodyRequest.MainTeacherId,
            TextBookId = request.BodyRequest.TextBookId,
            StartDate = request.BodyRequest.StartDate,
            EndDate = request.BodyRequest.EndDate,
            Status = request.BodyRequest.Status,
        };

        var result = _context.Classes.Add(entity);

        if (request.BodyRequest.SecondaryTeacherIds != null)
        {
            result.Entity.SecondaryTeachers = request.BodyRequest.SecondaryTeacherIds
                .Select(techerId => new TeacherClass
                {
                    TeacherId = techerId,
                    ClassId = result.Entity.Id
                }).ToList();
        }

        await _context.SaveChangesAsync(cancellationToken);

        await _classSevices.GenerateQrCode(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(entity.Id);
    }
}