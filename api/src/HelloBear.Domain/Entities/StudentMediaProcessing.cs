using HelloBear.Domain.Common;
using HelloBear.Domain.Enums;

namespace HelloBear.Domain.Entities;

public class StudentMediaProcessing : BaseAuditableEntity
{
    public Guid RequestId { get; set; }

    public StudentMediaStatus Status { get; set; }

    public long BytesSent { get; set; }

    public string? Exception { get; set; }
}
