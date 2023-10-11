using Microsoft.AspNetCore.Identity;

namespace HelloBear.Domain.Entities;

public class ApplicationRole : IdentityRole
{
    public ApplicationRole() : base()
    {
    }
    public ApplicationRole(string roleName) : base(roleName)
    {
    }

    public virtual ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
}
