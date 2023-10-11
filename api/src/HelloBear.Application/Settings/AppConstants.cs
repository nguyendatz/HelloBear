using System.Drawing;

namespace HelloBear.Application.Settings;

public static class AppConstants
{
    public const string SuperAdminRole = "SuperAdmin";
    public const string AdminRole = "Administrator";
    public const string TeacherRole = "Teacher";
    public static readonly string[] RoleList = new string[]
    {
        SuperAdminRole, AdminRole, TeacherRole
    };

    public const int StartPageNumber = 1;
    public const int PageSize = 10;
    public const int HashLength = 6;

    public const string EmailSignaturePath = "assets/Hello_You_Email_Signature_Logo.png";

    public static class ResponseCodeMessage
    {
        public const string AccountNotExists = "messages.accountNotExists";
        public const string AccountActive = "messages.accountActive";
        public const string AccountDeactive = "messages.accountDeactive";
        public const string AccountIncomplete = "messages.accountIncomplete";
        public const string NewPasswordIsSameOldPassword = "messages.newPasswordIsSameOldPassword";
        public const string ValidationFailed = "messages.validationFailed";
        public const string EmailTokenExpired = "messages.emailTokenExpired";
        public const string UserTokenValid = "messages.userTokenValid";
        public const string RecordNotFound = "messages.recordNotFound";
        public const string EmailExisted = "messages.emailExisted";
        public const string ShortNameExisted = "messages.shortNameExisted";
        public const string CantDeleteTextBookHasClasses = "messages.cantDeleteTextBookHasClasses";
    }

    public static class QrCodeGenerator
    {
        public const int PixelPerModule = 10;
        public const int IconSizePercent = 15;
        public const int IconBorderWidth = 5;
        public const bool DrawQuiteZones = true;
        public const string ReadIconFilePath = @"assets\read.png";
        public const string MusicIconFilePath = @"assets\music.png";
        public const string VideoIconFilePath = @"assets\video.png";
        public const string GameIconFilePath = @"assets\game.png";
        public const string PushAndListenIconFilePath = @"assets\pushAndListen.png";
        public const string RecordFilePath = @"assets\record.png";
        public static readonly Color MainColor = Color.FromArgb(255, 0, 150, 255);
    }
}