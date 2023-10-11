using System.Text;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using HelloBear.Infrastructure.Interceptors;
using HelloBear.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Internal;
using Microsoft.IdentityModel.Tokens;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSetting>(configuration.GetSection("JwtSetting"));
        services.Configure<SystemSetting>(configuration.GetSection("SystemSetting"));
        services.Configure<MailSetting>(configuration.GetSection("MailSetting"));
        services.Configure<BlobStorageSettings>(configuration.GetSection("SystemSetting"));
        services.Configure<BlobStorageConnectionSettings>(configuration.GetSection("ConnectionStrings"));
        services.Configure<YoutubeApiSettings>(configuration.GetSection("YoutubeApiSettings"));

        services.AddScoped<AuditableEntitySaveChangesInterceptor>();

        services.AddDbContext<HelloBearDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    builder => builder.MigrationsAssembly(typeof(HelloBearDbContext).Assembly.FullName)));

        var identityBuilder = services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
        {
            options.SignIn.RequireConfirmedAccount = true;

            options.Password.RequireDigit = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 8;
            options.Password.RequiredUniqueChars = 1;
        });

        identityBuilder.AddEntityFrameworkStores<HelloBearDbContext>();
        identityBuilder.AddDefaultTokenProviders();

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<HelloBearDbContext>());

        services.AddScoped<HelloBearDbContextInitialiser>();

        services.TryAddSingleton<ISystemClock, SystemClock>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                ValidIssuer = configuration["JwtSetting:Issuer"],
                ValidAudience = configuration["JwtSetting:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["JwtSetting:Key"]))
            };
        });

        services.AddAuthorization(options =>
        {
            var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
                JwtBearerDefaults.AuthenticationScheme);
            defaultAuthorizationPolicyBuilder =
                defaultAuthorizationPolicyBuilder.RequireAuthenticatedUser();
            options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();

        });

        return services;
    }
}
