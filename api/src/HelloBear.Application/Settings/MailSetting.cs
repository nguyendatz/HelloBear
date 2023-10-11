namespace HelloBear.Application.Settings;

public class MailSetting
{
    public string Host { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int Port { get; set; }
    public bool EnableSsl { get; set; }
}
