namespace HelloBear.Application.Lessons.Shared.Models;
public record LessonBodyRequest
{
    public int TextBookId { get; set; }
    public string Number { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LanguageFocus { get; set; } = string.Empty;   
    public string Phonics { get; set; } = string.Empty;
}