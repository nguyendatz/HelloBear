using AutoMapper;
using HelloBear.Application.Users.Queries.GetAllTeachers;
using HelloBear.Application.Users.Queries.GetRolesWithPagination;
using HelloBear.Application.Users.Queries.GetUsersWithPagination;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Users;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ApplicationUser, UserListResponse>();
        CreateMap<ApplicationUser, UserDetailResponse>()
            .ForMember(x => x.RoleId, (options) => options.MapFrom(x => x.Roles.First().Id));
        CreateMap<ApplicationRole, RoleResponse>();
        CreateMap<ApplicationRole, string>().ConvertUsing(x => x.Name);
        CreateMap<ApplicationUser, GetAllTeachersResponse>();
    }
}