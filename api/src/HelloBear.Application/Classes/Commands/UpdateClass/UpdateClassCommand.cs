using HelloBear.Application.Classes.Shared.Models;
using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Classes.Commands.CreateClass;

public record UpdateClassCommand(int Id, ClassBodyRequest BodyRequest) : IRequest<OperationResult<int>>;

public class UpdateClassCommandHandler : IRequestHandler<UpdateClassCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;
    private readonly IClassService _classSevice;

    public UpdateClassCommandHandler(IApplicationDbContext context, IClassService classSevice)
    {
        _context = context;
        _classSevice = classSevice;
    }

    public async Task<OperationResult<int>> Handle(UpdateClassCommand request, CancellationToken cancellationToken)
    {
        Class? existingClass = _context.Classes.Include(c => c.TextBook).Include(c => c.SecondaryTeachers).FirstOrDefault(c => c.Id.Equals(request.Id));

        if (existingClass is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The resource you have requested cannot be found");
        }

        existingClass.ClassName = request.BodyRequest.ClassName;
        existingClass.Status = request.BodyRequest.Status;
        existingClass.StartDate = request.BodyRequest.StartDate;
        existingClass.EndDate = request.BodyRequest.EndDate;
        if (!existingClass.TextBookId.Equals(request.BodyRequest.TextBookId))
        {
            existingClass.ClassCode = request.BodyRequest.TextBookShortName + existingClass.ClassCode.Substring(2);
            existingClass.TextBookId = request.BodyRequest.TextBookId;
        }
        var inputTeacherIds = request.BodyRequest.SecondaryTeacherIds ?? Enumerable.Empty<string>().ToList();
        var secondaryTeachersInDb = (existingClass.SecondaryTeachers ?? Enumerable.Empty<TeacherClass>()).ToList();

        var teacherListDelete = secondaryTeachersInDb
                    .Where(teacher => string.IsNullOrEmpty(teacher.TeacherId) || !inputTeacherIds.Contains(teacher.TeacherId))
                    .ToList();

        var currentTeacherIds = secondaryTeachersInDb.Select(teacher => teacher.TeacherId).ToList();
        var teacherListInsert = inputTeacherIds
                .Distinct()
                .Where(teacherId => !currentTeacherIds.Contains(teacherId))
                .Select(teacherId => new TeacherClass
                {
                    TeacherId = teacherId,
                    ClassId = request.Id
                }).ToList();

        if (teacherListInsert.Any())
        {
            _context.TeacherClass.AddRange(teacherListInsert);
        }
        if (teacherListDelete.Any())
        {
            _context.TeacherClass.RemoveRange(teacherListDelete);
        }

        if (string.IsNullOrEmpty(existingClass.QrCodePath))
        {
            existingClass = await _classSevice.GenerateQrCode(existingClass);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(existingClass.Id);
    }
}