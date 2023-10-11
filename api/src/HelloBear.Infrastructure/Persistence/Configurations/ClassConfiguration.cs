using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class ClassConfiguration : IEntityTypeConfiguration<Class>
{
    public void Configure(EntityTypeBuilder<Class> builder)
    {
        builder.Property(e => e.ClassName)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(e => e.StartDate)
            .IsRequired();

        builder.Property(e => e.EndDate)    
            .IsRequired();

        builder.Property(e => e.StartDate)
            .IsRequired();
        builder.Property(e => e.MainTeacherId)
            .IsRequired();
    }
}

