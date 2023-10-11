using FluentValidation;

namespace HelloBear.Application.Units.Queries.GetUnitsWithPagination;

public class GetUnitsWithPaginationQueryValidator : AbstractValidator<GetUnitsWithPaginationQuery>
{
    public GetUnitsWithPaginationQueryValidator()
    {
        RuleFor(x => x.TextbookId).NotEqual(0);
    }
}
