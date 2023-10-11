using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HelloBear.Application.Classes.Shared.Services;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Application.TextBooks.Commands.UpsertTextBook;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Students.Commands;

public record StudentProfile
{
    public int Id { get; set; }
    public string Name { get; set;} = string.Empty;
    public string ClassHashCode { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public int TextBookId { get; set; }

}

public record CreateStudentCommand : IRequest<OperationResult<StudentProfile>>
{
    public string Name { get; set; } = string.Empty;
    public string HashCode { get; set; } = string.Empty;
}

public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, OperationResult<StudentProfile>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IClassService _classSevices;

    public CreateStudentCommandHandler(IApplicationDbContext dbContext, IClassService classSevices)
    {
        _dbContext = dbContext;
        _classSevices = classSevices;
    }

    public async Task<OperationResult<StudentProfile>> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        int classId = await _classSevices.DecodeClassHashCode(request.HashCode);
        Class entityClass = _dbContext.Classes.FirstOrDefault(c => c.Id == classId);
        if (entityClass != null)
        {
            StudentClass studentClass = new StudentClass() 
            {  
                Student = new Student()
                {
                    Name = request.Name
                }, 
                ClassId = classId 
            };
            _dbContext.StudentClasses.Add(studentClass);

            await _dbContext.SaveChangesAsync(cancellationToken);
            StudentProfile studentResult = new StudentProfile()
            {
                Id = studentClass.StudentId,
                Name = request.Name,
                ClassHashCode = request.HashCode,
                ClassId = classId,
                TextBookId = studentClass.Class.TextBookId
            };
            return OperationResult.Ok(studentResult);
        }
        else
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The class cannot be found");
        }

    }
}