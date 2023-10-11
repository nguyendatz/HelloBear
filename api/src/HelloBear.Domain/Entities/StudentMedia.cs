using HelloBear.Domain.Common;
using HelloBear.Domain.Enums;

namespace HelloBear.Domain.Entities;

public class StudentMedia : BaseAuditableEntity
{
    public int ClassId { get; set; }

    public int LessonId { get; set; }

    public int StudentId { get; set; }

    public string Url { get; set; } = string.Empty;

    public string? Thumbnail { get; set; }

    public MediaType Type { get; set; }

    public int LikeNumber { get; set; }

    public int HeartNumber { get; set; }

    public Student Student { get; set; }
}