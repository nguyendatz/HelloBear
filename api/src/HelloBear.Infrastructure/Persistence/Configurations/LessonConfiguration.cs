using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.Property(t => t.TextBookId)
            .IsRequired();

        builder.Property(t => t.Order)
            .IsRequired();

        builder.Property(t => t.Number)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(t => t.Name)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(l => l.LanguageFocus)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(l => l.Phonics)
            .HasMaxLength(256)
            .IsRequired();
    }
}