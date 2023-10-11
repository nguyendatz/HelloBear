using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using HelloBear.Application.Auth.Shared;
using HelloBear.Application.Auth.Shared.Models;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace HelloBear.Infrastructure.Identity;

public class JwtService : IJwtService
{
    private readonly JwtSetting _jwtSetting;
    private readonly ILogger<JwtService> _logger;
    public JwtService(IOptions<JwtSetting> jwtSetting, ILogger<JwtService> logger)
    {
        _jwtSetting = jwtSetting.Value;
        _logger = logger;
    }

    public string GenerateAccessToken(ApplicationUser user, IList<Claim> userClaims, IList<string> roles)
    {
        var roleClaims = new List<Claim>();

        for (int i = 0; i < roles.Count; i++)
        {
            roleClaims.Add(new Claim(ClaimTypes.Role, roles[i]));
        }

        var claims = new[]
        {
                new Claim(ClaimTypes.NameIdentifier, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }
        .Union(userClaims)
        .Union(roleClaims);

        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSetting.Key));
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwtSetting.Issuer,
                audience: _jwtSetting.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(_jwtSetting.AccessTokenExpiryDuration),
                signingCredentials: signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
    }

    public string GenerateRefreshToken(int length = 32)
    {
        var randomNumber = new byte[length];

        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);

        RefreshToken token = new()
        {
            Key = Convert.ToBase64String(randomNumber),
            Expiration = DateTimeOffset.UtcNow.AddDays(_jwtSetting.RefreshTokenExpiryDuration)
        };

        string tokenString = JsonSerializer.Serialize(token, new JsonSerializerOptions());
        // A quirk of the system.text.json serialier is that it escapes the + char, which is used in base64.
        // Unfortunately that creates invalid json when used in this context.
        // So we de-escape the + char. This creates valid json that can be accurately deserialized
        tokenString = tokenString.Replace(@"\u002B", "+");

        return tokenString;
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSetting.Key));
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidAudience = _jwtSetting.Audience,
            ValidateIssuer = true,
            ValidIssuer = _jwtSetting.Issuer,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtSetting.Key)),
            ValidateLifetime = false // Will validate manually
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

        // Validate token's Security algorithms
        if (securityToken is not JwtSecurityToken jwtSecurityToken
            || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenException("Invalid JWT token.");
        }

        return principal;
    }

    public bool IsRefreshTokenExpired(string refreshToken)
    {
        bool isExpired = false;
        try
        {
            RefreshToken token = JsonSerializer.Deserialize<RefreshToken>(refreshToken);
            if (token?.Expiration != null && token.Expiration.Value < DateTimeOffset.UtcNow)
            {
                isExpired = true;
            }
        }
#pragma warning disable CS0168
        catch (Exception ex)
        {
            // if the token doesn't represent a RefreshToken object, it doesn't have an expiration date
            _logger.LogError(ex, "An error occurred while deserializing Refresh Token.");
        }

        return isExpired;
    }
}