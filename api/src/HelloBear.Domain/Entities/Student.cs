using HelloBear.Domain.Common;

namespace HelloBear.Domain.Entities;

public class Student : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public IList<StudentClass> StudentClasses { get; set; }
}
