using AutoMapper;
using HelloBear.Application.Communities.Queries.GetMediaStatus;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Communities;
internal class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<StudentMediaProcessing, GetMediaStatusResponse>();
    }
}