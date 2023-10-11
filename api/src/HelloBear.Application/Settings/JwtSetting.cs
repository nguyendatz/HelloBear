﻿namespace HelloBear.Application.Settings;

public class JwtSetting
{
    public string Key { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public double AccessTokenExpiryDuration { get; set; } // hours
    public double RefreshTokenExpiryDuration { get; set; } // days
}

