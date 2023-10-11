using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class TextBookConfiguration : IEntityTypeConfiguration<TextBook>
{
    public void Configure(EntityTypeBuilder<TextBook> builder)
    {
        builder.Property(t => t.Name)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(t => t.ShortName)
            .HasMaxLength(3)
            .IsRequired();

        builder.HasIndex(t => t.ShortName)
            .IsUnique();
    }
}
