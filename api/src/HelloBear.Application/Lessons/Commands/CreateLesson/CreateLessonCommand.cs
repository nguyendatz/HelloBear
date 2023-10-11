using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Lessons.Shared.Models;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Lessons.Commands.CreateLesson;
public record CreateLessonCommand(LessonBodyRequest BodyRequest) : IRequest<OperationResult<int>>;

public class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;

    public CreateLessonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult<int>> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
    {
        var textBook = await _context.TextBooks
            .Include(t => t.Lessons)
            .FirstOrDefaultAsync(t => t.Id == request.BodyRequest.TextBookId);

        if (textBook is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(TextBook)} with Id:{request.BodyRequest.TextBookId}");
        }

        var order = textBook.Lessons.Any() ? textBook.Lessons.Max(l => l.Order) + 1 : 1;
        Lesson newLesson = new Lesson
        {
            TextBook = textBook,
            Order = order,
            Number = request.BodyRequest.Number,
            Name = request.BodyRequest.Name,
            Description = request.BodyRequest.Description,
            LanguageFocus = request.BodyRequest.LanguageFocus,
            Phonics = request.BodyRequest.Phonics,
        };

        var lessonEntity = _context.Lessons.Add(newLesson);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(lessonEntity.Entity.Id);
    }
}