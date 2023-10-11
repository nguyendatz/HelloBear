namespace HelloBear.Application.Common.Models.Paging;

public class SortCriteria
{
    public string SortKey { get; set; } = string.Empty;

    public bool IsDescending { get; set; }
}