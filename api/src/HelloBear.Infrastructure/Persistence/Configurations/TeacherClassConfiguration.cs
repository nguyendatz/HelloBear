using System;
using System.ComponentModel.DataAnnotations.Schema;
using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HelloBear.Infrastructure.Persistence.Configurations;

public class TeacherClassConfiguration : IEntityTypeConfiguration<TeacherClass>
{

    public void Configure(EntityTypeBuilder<TeacherClass> builder)
    {
        // builder.HasIndex(sc => new { sc.ClassId, sc.TeacherId }).IsUnique();
    }
}
