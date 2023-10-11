namespace HelloBear.Application.Settings;

public class YoutubeApiSettings
{
    public required string ClientId { get; set; }
    public required string ClientSecret { get; set; }
    public required string ApplicationName { get; set; }
    public required string UserName { get; set; }
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}