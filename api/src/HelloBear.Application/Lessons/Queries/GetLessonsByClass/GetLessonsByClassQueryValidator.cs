using FluentValidation;

namespace HelloBear.Application.Lessons.Queries.GetLessonsByClass;

public class GetLessonsByClassQueryValidator : AbstractValidator<GetLessonsByClassQuery>
{
    public GetLessonsByClassQueryValidator()
    {
        RuleFor(x => x.ClassId).NotEqual(0);
    }
}