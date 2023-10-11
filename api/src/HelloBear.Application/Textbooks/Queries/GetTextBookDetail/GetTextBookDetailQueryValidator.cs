using FluentValidation;
namespace HelloBear.Application.TextBooks.Queries.GetTextBookDetail;

public class GetUnitsWithPaginationQueryValidator : AbstractValidator<GetTextBookDetailQuery>
{
    public GetUnitsWithPaginationQueryValidator()
    {
        RuleFor(x => x.Id).NotEqual(0);
    }
}
