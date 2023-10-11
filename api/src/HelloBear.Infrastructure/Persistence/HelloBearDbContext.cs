using System.Reflection;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Domain.Entities;
using HelloBear.Infrastructure.Interceptors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Infrastructure.Persistence;

public class HelloBearDbContext : IdentityDbContext<
    ApplicationUser, ApplicationRole, string,
    IdentityUserClaim<string>, ApplicationUserRole, IdentityUserLogin<string>,
    IdentityRoleClaim<string>, IdentityUserToken<string>>, IApplicationDbContext
{
    private readonly AuditableEntitySaveChangesInterceptor _auditableEntitySaveChangesInterceptor;

    public HelloBearDbContext(DbContextOptions<HelloBearDbContext> options, AuditableEntitySaveChangesInterceptor auditableEntitySaveChangesInterceptor)
            : base(options)
    {
        _auditableEntitySaveChangesInterceptor = auditableEntitySaveChangesInterceptor;
    }

    public DbSet<Class> Classes => Set<Class>();
    public DbSet<TextBook> TextBooks => Set<TextBook>();
    public DbSet<TeacherClass> TeacherClass => Set<TeacherClass>();

    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Content> Contents => Set<Content>();
    public DbSet<PushAndListen> PushAndListen => Set<PushAndListen>();
    public DbSet<StudentClass> StudentClasses => Set<StudentClass>();

    public DbSet<StudentMedia> StudentMedias => Set<StudentMedia>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<StudentMediaProcessing> StudentMediaProcessings => Set<StudentMediaProcessing>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>()
            .Property(t => t.FirstName)
            .HasMaxLength(256)
            .IsRequired();

        builder.Entity<ApplicationUser>()
            .Property(t => t.LastName)
            .HasMaxLength(256)
            .IsRequired();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.AddInterceptors(_auditableEntitySaveChangesInterceptor);
    }
}