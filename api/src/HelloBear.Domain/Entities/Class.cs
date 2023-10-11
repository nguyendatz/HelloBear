using HelloBear.Domain.Common;
using HelloBear.Domain.Enums;

namespace HelloBear.Domain.Entities;

public class Class : BaseAuditableEntity
{
    public string? MainTeacherId { get; set; }
    public int TextBookId { get; set; }

    public string ClassName { get; set; } = string.Empty;

    public TextBookLevel TextBookLevel { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public ClassStatus Status { get; set; }

    public string ClassCode { get; set; } = string.Empty;

    public string HashUrl { get; set; } = string.Empty;

    public string QrCodePath { get; set; } = string.Empty; // Generated from HashUrl

    public TextBook? TextBook { get; set; }

    public ApplicationUser? MainTeacher { get; set; }
    public IList<TeacherClass> SecondaryTeachers { get; set; }
    public IList<StudentClass> StudentClasses { get; set; }
}
