using HelloBear.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    DbSet<Class> Classes { get; }
    DbSet<ApplicationUser> Users { get; }
    DbSet<TextBook> TextBooks { get; }
    DbSet<TeacherClass> TeacherClass { get; }
    DbSet<ApplicationRole> Roles { get; }
    DbSet<ApplicationUserRole> UserRoles { get; }
    DbSet<Lesson> Lessons { get; }
    DbSet<Content> Contents { get; }
    DbSet<StudentMedia> StudentMedias { get; }
    DbSet<Student> Students { get; }
    DbSet<PushAndListen> PushAndListen { get; }
    DbSet<StudentClass> StudentClasses { get; }
    DbSet<StudentMediaProcessing> StudentMediaProcessings { get; }
}