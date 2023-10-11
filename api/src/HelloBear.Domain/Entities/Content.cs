using HelloBear.Domain.Common;
using HelloBear.Domain.Enums;

namespace HelloBear.Domain.Entities;

public class Content : BaseAuditableEntity
{
    public int LessonId { get; set; }

    public int PageNumber { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string PageImage { get; set; } = string.Empty;

    public ContentType Type { get; set; } = ContentType.None;

    public string? YoutubeLink { get; set; }

    public string? WordwallNetLink { get; set; }

    public string HashUrl { get; set; } = string.Empty;

    public string QrCodePath { get; set; } = string.Empty; // Generated from HashUrl

    public Lesson Lesson { get; set; }

    public IList<PushAndListen> PushAndListens { get; set; } = null!;
}