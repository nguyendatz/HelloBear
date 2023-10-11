namespace HelloBear.Application.Common.Models.Paging;

public abstract record PageQueryWithSearchTextBase : PageQueryBase
{
    public string? SearchText { get; init; }
}