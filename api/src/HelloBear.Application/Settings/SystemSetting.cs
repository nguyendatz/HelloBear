namespace HelloBear.Application.Settings;

public class SystemSetting
{
    public string ApiBaseUrl { get; set; } = string.Empty;

    public string ClientAppBaseUrl { get; set; } = string.Empty;

    public string ClientAppSetPasswordPath { get; set; } = string.Empty;

    public string ClientAppStudentClassPath { get; set; } = string.Empty;

    public string ClientAppStudentContentPath { get; set; } = string.Empty;

    public double EmailTokenExpiredTime { get; set; } // hour

    public string ResetPasswordEmailSubject { get; set; } = string.Empty;

    public string InvitationEmailSubject { get; set; } = string.Empty;

    public string ConfirmedPasswordChangedEmailSubject { get; set; } = string.Empty;

    public string ContactInfo { get; set; } = string.Empty;

    public string ContactInfoUrl { get; set; } = string.Empty;

    public string Salt { get; set; } = string.Empty;
}