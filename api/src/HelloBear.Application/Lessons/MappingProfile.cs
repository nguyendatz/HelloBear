using AutoMapper;
using HelloBear.Application.Lessons.Queries.GetLessonDetail;
using HelloBear.Application.Lessons.Queries.GetLessonsByClass;
using HelloBear.Application.Lessons.Shared.Models;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Lessons;

internal class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Lesson, LessonDetailResponse>()
            .ForMember(dest => dest.TextBookName, opt => opt.MapFrom(src => src.TextBook.Name));
        CreateMap<LessonBodyRequest, Lesson>();
        CreateMap<Lesson, LessonsByClassResponse>();
    }
}