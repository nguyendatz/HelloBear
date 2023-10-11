namespace HelloBear.Application.Auth.Shared.Models;

public class RefreshToken
{
    public string Key { get; set; }
    public DateTimeOffset? Expiration { get; set; }
}