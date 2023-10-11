using FluentValidation;

namespace HelloBear.Application.Communities.Queries.GetCommunities;

public class GetCommunitiesQueryValidator : AbstractValidator<GetCommunitiesQuery>
{
    public GetCommunitiesQueryValidator()
    {
        RuleFor(x => x.ClassId).NotEqual(0);
    }
}