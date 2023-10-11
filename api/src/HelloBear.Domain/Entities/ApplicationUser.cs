using HelloBear.Domain.Enums;
using Microsoft.AspNetCore.Identity;
namespace HelloBear.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserStatus Status { get; set; } = UserStatus.Invited;
    public PhoneType? PhoneType { get; set; }
    public DateTimeOffset DateCreated { get; set; }
    public string FullName => $"{LastName} {FirstName}".Trim();
    public virtual ICollection<ApplicationRole> Roles { get; set; } = new List<ApplicationRole>();
}
