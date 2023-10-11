using HelloBear.Application.Common.Models;

namespace HelloBear.Application.Common.Interfaces;

public interface IIdentityService : ITransientService
{
    Task<string?> GetUserNameAsync(string userId);

    Task<bool> IsInRoleAsync(string userName, string role);

    Task<bool> AuthorizeAsync(string userName, string policyName);

    Task<(Result Result, string UserId)> CreateUserAsync(string userName, string password);

    Task<Result> DeleteUserAsync(string userId);
}