using AutoMapper;
using HelloBear.Application.Contents.Queries;
using HelloBear.Application.Contents.Queries.GetContentDetail;
using HelloBear.Application.Contents.Shared.Models;
using HelloBear.Application.Students.Commands;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Students;
internal class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Content, StudentContentDetailResponse>()
            .ForMember(dest => dest.LessonName, opt => opt.MapFrom(src => src.Lesson.Name))
            .ForMember(dest => dest.TextBookName, opt => opt.MapFrom(src => src.Lesson.TextBook.Name));

        CreateMap<PushAndListen, StudentPushAndListenResponse>();
    }
}