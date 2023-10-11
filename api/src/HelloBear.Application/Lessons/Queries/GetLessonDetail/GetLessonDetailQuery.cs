using AutoMapper;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Lessons.Queries.GetLessonDetail;

public record GetLessonDetailQuery(int Id) : IRequest<OperationResult<LessonDetailResponse>>;

public class LessonDetailResponse
{
    public int Id { get; set; }
    public int TextBookId { get; set; }
    public int Order { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LanguageFocus { get; set; } = string.Empty;
    public string Phonics { get; set; } = string.Empty;
    public string TextBookName { get; set; } = string.Empty;
}

public class GetLessonDetailQueryHandler : IRequestHandler<GetLessonDetailQuery, OperationResult<LessonDetailResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetLessonDetailQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<OperationResult<LessonDetailResponse>> Handle(GetLessonDetailQuery request, CancellationToken cancellationToken)
    {
        var lessonEntity = await _dbContext.Lessons.Include(l => l.TextBook).AsNoTracking().FirstOrDefaultAsync(c => c.Id.Equals(request.Id));
        if (lessonEntity is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"The resource you have requested cannot be found");
        }

        var lessonDetailResponse = _mapper.Map<LessonDetailResponse>(lessonEntity);

        return OperationResult.Ok(lessonDetailResponse);
    }
}