using System.Text.Json;
using Google.Apis.YouTube.v3;
using HelloBear.Application.Settings;
using Microsoft.ApplicationInsights.AspNetCore.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace HelloBear.Api.Controllers;

// Youtube API doesn't support to authenticate with predefined credentials so we need to generate access token & refresh token mannually,
// then store them to appsettings.json for later use
public class YoutubeHelperController : ApiControllerBase
{
    private readonly YoutubeApiSettings _settings;
    private readonly IHttpClientFactory _httpClientFactory;

    public YoutubeHelperController(IOptions<YoutubeApiSettings> settings, IHttpClientFactory httpClientFactory)
    {
        _settings = settings.Value;
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("generate-token")]
    public IActionResult GenerateToken()
        => Redirect($"https://accounts.google.com/o/oauth2/v2/auth" +
            $"?scope={YouTubeService.Scope.Youtube}" +
            $"&access_type=offline" +
            $"&response_type=code" +
            $"&prompt=consent" +
            $"&redirect_uri={Request.GetUri().GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)}/api/youtubehelper/code" +
            $"&client_id={_settings.ClientId}");

    [HttpGet("code")]
    public async Task<IActionResult> Code(string code)
    {
        var httpClient = _httpClientFactory.CreateClient();
        var url = "https://oauth2.googleapis.com/token";
        var parameters = new
        {
            client_id = _settings.ClientId,
            client_secret = _settings.ClientSecret,
            code = code,
            grant_type = "authorization_code",
            redirect_uri = $"{Request.GetUri().GetComponents(UriComponents.SchemeAndServer, UriFormat.Unescaped)}/api/youtubehelper/code"
        };
        using HttpResponseMessage response = await httpClient.PostAsync(url, new StringContent(JsonSerializer.Serialize(parameters)));
        return Ok(await response.Content.ReadAsStringAsync());
    }
}
