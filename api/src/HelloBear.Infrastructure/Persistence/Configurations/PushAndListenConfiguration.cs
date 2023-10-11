using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class PushAndListenConfiguration : IEntityTypeConfiguration<PushAndListen>
{
    public void Configure(EntityTypeBuilder<PushAndListen> builder)
    {
        builder.Property(pnl => pnl.AudioFileUrl)
            .IsRequired();

        builder.Property(pnl => pnl.Name)
            .HasMaxLength(256)
            .IsRequired();
    }
}
