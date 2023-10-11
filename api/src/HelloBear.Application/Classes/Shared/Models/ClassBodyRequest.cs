using HelloBear.Domain.Enums;

namespace HelloBear.Application.Classes.Shared.Models;
public record ClassBodyRequest
{
    public string ClassCode { get; set; } = string.Empty;
    public string ClassName { get; set; } = string.Empty;
    public int TextBookId { get; set; }
    public string MainTeacherId { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public ClassStatus Status { get; set; }
    public IList<string>? SecondaryTeacherIds { get; set; }
    public string MainTeacherShortName { get; set; } = string.Empty;
    public string TextBookShortName { get; set; } = string.Empty;
}
