using AutoMapper;
using HelloBear.Application.PushAndListens.Queries;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.PushAndListens;
internal class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<PushAndListen, PushAndListenResponse>();
    }
}