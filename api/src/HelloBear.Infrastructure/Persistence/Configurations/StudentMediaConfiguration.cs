using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class StudentMediaConfiguration : IEntityTypeConfiguration<StudentMedia>
{
    public void Configure(EntityTypeBuilder<StudentMedia> builder)
    {
        builder.Property(sm => sm.Url)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(sm => sm.Thumbnail)
            .HasMaxLength(2000);
    }
}