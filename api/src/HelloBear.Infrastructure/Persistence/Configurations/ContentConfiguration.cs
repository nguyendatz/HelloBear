using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class ContentConfiguration : IEntityTypeConfiguration<Content>
{
    public void Configure(EntityTypeBuilder<Content> builder)
    {
        builder.Property(t => t.LessonId)
            .IsRequired();

        builder.Property(t => t.PageNumber)
            .IsRequired();

        builder.Property(t => t.Name)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(t => t.PageImage)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(t => t.YoutubeLink)
            .HasMaxLength(2000);

        builder.Property(t => t.WordwallNetLink)
            .HasMaxLength(2000);

        builder.Property(t => t.HashUrl)
            .HasMaxLength(2000)
            .IsRequired();

        builder.Property(t => t.QrCodePath)
            .HasMaxLength(2000)
            .IsRequired();
    }
}