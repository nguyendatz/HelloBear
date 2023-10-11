using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Domain.Enums;
using MediatR;

namespace HelloBear.Application.Classes.Queries.GetClassesWithPagination;

public record ClassResponse
{
    public int Id { get; set; }
    public string? ClassCode { get; set; }
    public string? ClassName { get; set; }
    public string? TextBookName { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ClassStatus Status { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MainTeacherName => $"{LastName}, {FirstName}".Trim();
    public IList<string>? SecondaryTeacherNames { get; set; }
}
public record GetClassesWithPaginationQuery : PageQueryWithSearchTextBase, IRequest<PaginatedList<ClassResponse>>
{
    public IList<ClassStatus>? ClassStatus { get; init; }
    public string? TeacherId { get; init; }
}

public class GetClassesWithPaginationQueryHandler : IRequestHandler<GetClassesWithPaginationQuery, PaginatedList<ClassResponse>>
{
    private readonly IApplicationDbContext _dbContext;

    public GetClassesWithPaginationQueryHandler(IApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaginatedList<ClassResponse>> Handle(GetClassesWithPaginationQuery request, CancellationToken cancellationToken)
    {
        var query = from c in _dbContext.Classes
                    select new
                    {
                        Id = c.Id,
                        ClassCode = c.ClassCode,
                        ClassName = c.ClassName,
                        Status = c.Status,
                        TextBookName = c.TextBook != null ? c.TextBook.Name : "",
                        FirstName = c.MainTeacher != null ? c.MainTeacher.FirstName : "",
                        LastName = c.MainTeacher != null ? c.MainTeacher.LastName : "",
                        StartDate = c.StartDate,
                        EndDate = c.EndDate,
                        SecondaryTeachers = c.SecondaryTeachers,
                        MainTeacherId = c.MainTeacherId,
                        CreatedBy = c.CreatedBy
                    };
        
        if (!string.IsNullOrWhiteSpace(request.SearchText))
        {
            query = query.Where(c => c.ClassName.Contains(request.SearchText)
                || c.TextBookName.Contains(request.SearchText)
                || c.ClassCode.Contains(request.SearchText)
            );
        }

        if (request.ClassStatus != null)
        {
            query = query.Where(c => request.ClassStatus.Contains(c.Status));
        }

        if (!string.IsNullOrWhiteSpace(request.TeacherId))
        {
            query = query.Where(c => c.MainTeacherId.Equals(request.TeacherId) || c.SecondaryTeachers.Select(s => s.TeacherId).Contains(request.TeacherId));
        }

        var result = await query
            .Select(x => new ClassResponse
            {
                Id = x.Id,
                ClassCode = x.ClassCode,
                ClassName = x.ClassName,
                TextBookName = x.TextBookName,
                FirstName = x.FirstName,
                LastName = x.LastName,
                Status = x.Status,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                SecondaryTeacherNames = x.SecondaryTeachers.Select(x => x.Teacher != null ? $"{x.Teacher.LastName}, {x.Teacher.FirstName}" : "").ToList()
            })
            .ToPaginatedListAsync(request);

        return result;
    }
}