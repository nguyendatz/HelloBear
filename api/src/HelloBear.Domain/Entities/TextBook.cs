using HelloBear.Domain.Common;

namespace HelloBear.Domain.Entities;

public class TextBook : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public string ShortName { get; set; } = string.Empty;

    public string? Thumbnail { get; set; }

    public string? Description { get; set; }

    public IList<Lesson> Lessons { get; set; } = new List<Lesson>();
}
