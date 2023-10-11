using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace HelloBear.Infrastructure.Common;
public class VideoService : IVideoService
{
    private const string EDUCATION_CATEGORY_ID = "27";
    private readonly YoutubeApiSettings _settings;

    public VideoService(IOptions<YoutubeApiSettings> settings)
    {
        _settings = settings.Value;
    }

    public async Task UploadVideo(IFormFile video, string title, Action<UploadVideoResponse> progressChanged, CancellationToken cancellationToken)
    {
        var service = GetYouTubeService();
        using var stream = video.OpenReadStream();
        var videosInsertRequest = service.Videos.Insert(new Video
        {
            Snippet = new VideoSnippet
            {
                Title = title,
                CategoryId = EDUCATION_CATEGORY_ID
            },
            Status = new VideoStatus
            {
                PrivacyStatus = "public"
            }
        }, "snippet,status", stream, "video/*");

        videosInsertRequest.ProgressChanged += (IUploadProgress progress) =>
        {
            switch (progress.Status)
            {
                case UploadStatus.Uploading:
                    progressChanged(new UploadVideoResponse
                    {
                        BytesSent = progress.BytesSent,
                        Status = UploadVideoStatus.Uploading
                    });
                    break;
                case UploadStatus.Failed:
                    progressChanged(new UploadVideoResponse
                    {
                        Exception = progress.Exception.ToString(),
                        Status = UploadVideoStatus.Failed
                    });
                    break;
                case UploadStatus.Completed:
                    progressChanged(new UploadVideoResponse
                    {
                        Link = $"https://www.youtube.com/watch?v={videosInsertRequest.ResponseBody.Id}",
                        Status = UploadVideoStatus.Completed
                    });
                    break;
            }
        };
        await videosInsertRequest.UploadAsync(cancellationToken);
    }

    private YouTubeService GetYouTubeService()
    {
        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = _settings.ClientId,
                ClientSecret = _settings.ClientSecret,
            },
            Scopes = new[] { YouTubeService.Scope.Youtube }
        });
        var token = new TokenResponse
        {
            AccessToken = _settings.AccessToken,
            RefreshToken = _settings.RefreshToken
        };

        return new YouTubeService(new BaseClientService.Initializer
        {
            ApplicationName = _settings.ApplicationName,
            HttpClientInitializer = new UserCredential(flow, _settings.UserName, token)
        });
    }
}
