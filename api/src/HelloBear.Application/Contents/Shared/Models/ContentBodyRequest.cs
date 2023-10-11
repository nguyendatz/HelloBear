using HelloBear.Domain.Enums;

namespace HelloBear.Application.Contents.Shared.Models;
public record ContentBodyRequest
{
    public int LessonId { get; set; }

    public int PageNumber { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string PageImage { get; set; } = string.Empty;

    public ContentType Type { get; set; } = ContentType.None;

    public string? YoutubeLink { get; set; }

    public string? WordwallNetLink { get; set; }
}
