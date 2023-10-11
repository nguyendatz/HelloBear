using HelloBear.Domain.Common;

namespace HelloBear.Domain.Entities;

public class StudentClass : BaseAuditableEntity
{
    public int StudentId { get; set; }

    public int ClassId { get; set; }

    public Student Student { get; set; }

    public Class Class { get; set; }
}
