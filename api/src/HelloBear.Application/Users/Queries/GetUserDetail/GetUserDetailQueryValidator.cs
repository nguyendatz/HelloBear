using FluentValidation;
namespace HelloBear.Application.Users.Queries.GetUsersWithPagination;

public class GetUserDetailQueryValidator : AbstractValidator<GetUserDetailQuery>
{
    public GetUserDetailQueryValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}