namespace HelloBear.Application.Common.Interfaces;

public interface ICurrentUserService : IScopedService
{
    string? UserName { get; }
}