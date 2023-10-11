using System;
using HelloBear.Domain.Common;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Domain.Entities;

public class TeacherClass : BaseAuditableEntity
{
    public string? TeacherId { get; set; }

    public int ClassId { get; set; }
    public ApplicationUser? Teacher { get; set; }
    public Class? Class { get; set; }
}
