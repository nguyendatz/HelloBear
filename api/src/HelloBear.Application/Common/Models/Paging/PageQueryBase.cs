using HelloBear.Application.Settings;

namespace HelloBear.Application.Common.Models.Paging;
public abstract record PageQueryBase
{
    public int PageNumber { get; init; } = AppConstants.StartPageNumber;
    public int PageSize { get; init; } = AppConstants.PageSize;
    public IEnumerable<SortCriteria>? SortCriteria { get; set; }
}