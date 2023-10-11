using HelloBear.Domain.Common;

namespace HelloBear.Domain.Entities;

public class Lesson : BaseAuditableEntity
{
    public int TextBookId { get; set; }
    public int Order { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string LanguageFocus { get; set; } = string.Empty;
    public string Phonics { get; set; } = string.Empty;

    public TextBook TextBook { get; set; } = new TextBook();

    public IList<Content> Contents { get; set; } = new List<Content>();
}
