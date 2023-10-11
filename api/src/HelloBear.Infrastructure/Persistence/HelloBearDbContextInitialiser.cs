using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace HelloBear.Infrastructure.Persistence;

public class HelloBearDbContextInitialiser
{
    private readonly ILogger<HelloBearDbContextInitialiser> _logger;
    private readonly HelloBearDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<ApplicationRole> _roleManager;

    public HelloBearDbContextInitialiser(ILogger<HelloBearDbContextInitialiser> logger, HelloBearDbContext context, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
    }

    private const string AdministratorEmail = "admin@altsourcesoftware.com";
    private const string SuperAdminEmail = "superadmin@altsourcesoftware.com";
    private const string Password = "Administrator1!";

    public async Task InitialiseAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();

                if (!await _context.Users.AnyAsync(x => x.UserName == AdministratorEmail))
                {
                    await SeedAsync();
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while initialising the database.");
            throw;
        }
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    public async Task TrySeedAsync()
    {
        // Default roles
        var superAdministratorRole = new ApplicationRole(AppConstants.SuperAdminRole);
        var administratorRole = new ApplicationRole(AppConstants.AdminRole);
        var teacherRole = new ApplicationRole(AppConstants.TeacherRole);

        var roles = await _roleManager.Roles.ToListAsync();

        if (roles.All(r => r.Name != superAdministratorRole.Name))
        {
            await _roleManager.CreateAsync(superAdministratorRole);
        }

        if (roles.All(r => r.Name != administratorRole.Name))
        {
            await _roleManager.CreateAsync(administratorRole);
        }

        if (roles.All(r => r.Name != teacherRole.Name))
        {
            await _roleManager.CreateAsync(teacherRole);
        }

        // Default users
        var administrator = new ApplicationUser
        {
            UserName = AdministratorEmail,
            Email = AdministratorEmail,
            EmailConfirmed = true,
            FirstName = "Admin",
            LastName = "Admin",
            DateCreated = DateTimeOffset.Now,
            Status = Domain.Enums.UserStatus.Actived
        };

        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, Password);
            if (!string.IsNullOrWhiteSpace(administratorRole.Name))
            {
                await _userManager.AddToRolesAsync(administrator, new[] { administratorRole.Name });
            }
        }

        // Super admin
        var superAdmin = new ApplicationUser
        {
            UserName = SuperAdminEmail,
            Email = SuperAdminEmail,
            EmailConfirmed = true,
            FirstName = "Super",
            LastName = "Admin",
            DateCreated = DateTimeOffset.Now,
            Status = Domain.Enums.UserStatus.Actived
        };
        if (_userManager.Users.All(u => u.UserName != superAdmin.UserName))
        {
            await _userManager.CreateAsync(superAdmin, Password);
            if (!string.IsNullOrWhiteSpace(superAdministratorRole.Name))
            {
                await _userManager.AddToRolesAsync(superAdmin, new[] { superAdministratorRole.Name });
            }
        }

        // Default data
        // Seed, if necessary
    }
}