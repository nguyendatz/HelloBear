using AutoMapper;
using HelloBear.Application.Classes.Queries.GetClassDetail;
using HelloBear.Application.Classes.Queries.GetClassesWithPagination;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Classes;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Class, ClassResponse>();
        CreateMap<Class, ClassDetailResponse>()
            .ForMember(dest => dest.MainTeacherFullName, opt => opt.MapFrom(src => src.MainTeacher.FullName))
            .ForMember(dest => dest.SecondaryTeacherIds, opt => opt.MapFrom(src => src.SecondaryTeachers.Where(e => !string.IsNullOrEmpty(e.TeacherId))
            .Select(x => x.TeacherId).ToList()));
    }
}