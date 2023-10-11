using AutoMapper;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Contents.Shared.Models;
using HelloBear.Application.Contents.Shared.Services;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Contents.Commands.CreateContent;
public record CreateContentCommand(ContentBodyRequest BodyRequest) : IRequest<OperationResult<int>>;

public class CreateContentCommandHandler : IRequestHandler<CreateContentCommand, OperationResult<int>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IContentService _contentService;

    public CreateContentCommandHandler(IApplicationDbContext context, IMapper mapper, IContentService contentService)
    {
        _context = context;
        _mapper = mapper;
        _contentService = contentService;
    }

    public async Task<OperationResult<int>> Handle(CreateContentCommand request, CancellationToken cancellationToken)
    {
        var lesson = await _context.Lessons.Include(l => l.TextBook)
            .FirstOrDefaultAsync(l => l.Id == request.BodyRequest.LessonId);
        if (lesson is null)
        {
            return OperationResult.NotFound($"{AppConstants.ResponseCodeMessage.RecordNotFound}", $"{nameof(Lesson)} with Id:{request.BodyRequest.LessonId}");
        }

        Content newContent = _mapper.Map<Content>(request.BodyRequest);
        var contentEntity = _context.Contents.Add(newContent);

        await _context.SaveChangesAsync(cancellationToken);

        await _contentService.GenerateQrCode(newContent, lesson.TextBook.ShortName);

        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.Ok(contentEntity.Entity.Id);
    }
}
