using AutoMapper;
using AutoMapper.QueryableExtensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Settings;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Users.Queries.GetAllTeachers;

public record GetAllTeachersResponse
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}

public record GetAllTeachersQuery : IRequest<List<GetAllTeachersResponse>>
{
}

public class GetClassesWithPaginationQueryHandler : IRequestHandler<GetAllTeachersQuery, List<GetAllTeachersResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetClassesWithPaginationQueryHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<GetAllTeachersResponse>> Handle(GetAllTeachersQuery request, CancellationToken cancellationToken)
        => await _dbContext.Users.Where(x => x.Roles.Any(y => y.Name == AppConstants.TeacherRole))
            .AsNoTracking()
            .ProjectTo<GetAllTeachersResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
}