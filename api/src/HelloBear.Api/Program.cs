using HelloBear.Api.Middlewares;
using HelloBear.Application;
using HelloBear.Application.Settings;
using HelloBear.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var environmentName = builder.Environment.EnvironmentName;
const string corsName = "HbCors";
var policyName = $"{corsName}_{environmentName}";

// Add services to the container.
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApiServices();

builder.Services.AddApplicationInsightsTelemetry();

builder.Services.AddAuthorization();
builder.Services.AddHealthChecks();

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: policyName, policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithExposedHeaders("Content-Disposition");

        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin();
        }
        else
        {
            var origins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
            policy.WithOrigins(origins);
        }
    });
});

var emailSetting = builder.Configuration.GetRequiredSection("MailSetting").Get<MailSetting>()!;

builder.Services
        .AddFluentEmail(emailSetting.UserName, emailSetting.DisplayName)
        .AddLiquidRenderer(options =>
        {
            // file provider is used to resolve layout files if they are in use
            //options.FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Views", "Layout"));
        })
        .AddSmtpSender(emailSetting.Host, emailSetting.Port, emailSetting.UserName, emailSetting.Password);

builder.Services.AddDependenciesInjection();

builder.Services.AddHttpClient();

var systemSetting = builder.Configuration.GetRequiredSection("SystemSetting").Get<SystemSetting>()!;
builder.Services.Configure<DataProtectionTokenProviderOptions>(options =>
    options.TokenLifespan = TimeSpan.FromHours(systemSetting.EmailTokenExpiredTime));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseOpenApi();
    app.UseSwaggerUi3();

    // Initialise and seed database
    using var scope = app.Services.CreateScope();
    var initialiser = scope.ServiceProvider.GetRequiredService<HelloBearDbContextInitialiser>();
    await initialiser.InitialiseAsync();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(Directory.GetCurrentDirectory(), @"assets")),
    RequestPath = new PathString("/assets")
});

app.UseRouting();

app.UseCors(policyName);

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ExceptionHandlerMiddleware>();

app.MapControllers();

app.Run();