using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder
            .HasMany(x => x.Roles)
            .WithMany(x => x.Users)
            .UsingEntity<ApplicationUserRole>(
                r => r.HasOne<ApplicationRole>().WithMany().HasForeignKey(e => e.RoleId),
                l => l.HasOne<ApplicationUser>().WithMany().HasForeignKey(e => e.UserId)
            );
    }
}

