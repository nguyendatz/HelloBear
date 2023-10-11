using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Lessons.Shared.Models;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;

namespace HelloBear.Application.Lessons.Commands.UpdateLesson;

public record UpdateLessonCommand(int Id, LessonBodyRequest BodyRequest) : IRequest<OperationResult<int>>;

internal class UpdateLessonCommandHandler : IRequestHandler<UpdateLessonCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;

    public UpdateLessonCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult<int>> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
    {
        var lesson = await _context.Lessons.FindAsync(request.Id);
        if (lesson is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(Lesson)} with Id:{request.Id}");
        }

        var textBook = await _context.TextBooks.FindAsync(request.BodyRequest.TextBookId);
        if (textBook is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(TextBook)} with Id:{request.BodyRequest.TextBookId}");
        }

        lesson.Name = request.BodyRequest.Name;
        lesson.Number = request.BodyRequest.Number;
        lesson.Description = request.BodyRequest.Description;
        lesson.LanguageFocus = request.BodyRequest.LanguageFocus;
        lesson.Phonics = request.BodyRequest.Phonics;
        lesson.TextBookId = textBook.Id;

        await _context.SaveChangesAsync(cancellationToken);
        return OperationResult.Ok(lesson.Id);
    }
}