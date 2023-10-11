using System.ComponentModel.DataAnnotations.Schema;

namespace HelloBear.Domain.Common;

public abstract class BaseEntity
{
    public int Id { get; set; }
}
