using AutoMapper;
using HelloBear.Application.Classes.Queries.GetClassesWithPagination;
using HelloBear.Application.TextBooks.Queries.GetTextbooksWithPagination;
using HelloBear.Application.TextBooks.Queries.GetTextBookDetail;
using HelloBear.Domain.Entities;
using HelloBear.Application.Units.Queries.GetUnitsWithPagination;

namespace HelloBear.Application.TextBooks;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<TextBook, TextBookDetailResponse>();
        CreateMap<Lesson, UnitResponse>();
        CreateMap<Class, ClassResponse>();
        CreateMap<TextBook, TextBookQueryResponse>();
    }
}