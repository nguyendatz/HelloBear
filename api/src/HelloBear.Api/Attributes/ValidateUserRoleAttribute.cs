using System.Security.Claims;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace HelloBear.Api.Attributes;

public class ValidateUserRoleAttribute : TypeFilterAttribute
{
    public ValidateUserRoleAttribute(params string[] roles) : base(typeof(ValidateUserRoleActionFilter))
    {
        Arguments = new object[] { roles };
    }

    public class ValidateUserRoleActionFilter : IAsyncActionFilter
    {
        private readonly string[] _roles;

        public ValidateUserRoleActionFilter(string[] roles)
        {
            _roles = roles;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var httpContext = context.HttpContext;

            if (httpContext is null)
            {
                context.Result = new ChallengeResult(JwtBearerDefaults.AuthenticationScheme);
                return;
            }

            var claimsPrincipal = httpContext.User;
            var claims = claimsPrincipal?.Claims;

            if (claimsPrincipal is null || claims is null)
            {
                context.Result = new ChallengeResult(JwtBearerDefaults.AuthenticationScheme);
                return;
            }

            var userName = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var role = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

            if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(role) || !AppConstants.RoleList.Contains(role))
            {
                context.Result = new ChallengeResult();
                return;
            }

            var isUserInRole = claimsPrincipal.IsInRole(role);

            if (!isUserInRole || !_roles.Any(x => x == role))
            {
                context.Result = new ChallengeResult(JwtBearerDefaults.AuthenticationScheme);
                return;
            }

            await next();
        }
    }
}
