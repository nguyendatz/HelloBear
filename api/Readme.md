# HelloBear

## Create migration script for HelloBear

When we have any new migrations, please use these powershell scripts to generate migration scripts which will be used
when
deploying by pipeline

We've setup running these scripts to increase performance

Before run these scripts, make sure you're standing on this path: `...\HelloBear\api\src` (src folder)

### App Migrations

```powershell
dotnet ef migrations script `
    --output MigrationScripts/AppMigration.sql `
    --idempotent `
    --project HelloBear.Infrastructure/HelloBear.Infrastructure.csproj `
    --context HelloBearDbContext `
    --startup-project HelloBear.Api/HelloBear.Api.csproj
```
