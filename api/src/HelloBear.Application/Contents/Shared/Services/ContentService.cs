using System.Text.RegularExpressions;
using HashidsNet;
using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using Microsoft.Extensions.Options;
using static QRCoder.Base64QRCode;

namespace HelloBear.Application.Contents.Shared.Services;

internal class ContentService : IContentService
{
    private readonly IBlobService _blobService;
    private readonly SystemSetting _systemSetting;

    public ContentService(IBlobService blobService, IOptions<SystemSetting> systemSetting)
    {
        _systemSetting = systemSetting.Value;
        _blobService = blobService;
    }

    public async Task<Content> GenerateQrCode(Content entity, string bookCode)
    {
        // build hash url
        var hashids = new Hashids(_systemSetting.Salt, AppConstants.HashLength);
        string hash = hashids.Encode(entity.Id);
        string hashUrl = $"{_systemSetting.ClientAppBaseUrl}{_systemSetting.ClientAppStudentContentPath}/{hash}";

        // generate qrcode
        string textBelow = $"{bookCode}-{entity.PageNumber}";
        string base64CodeImage = hashUrl.GenerateQrCodeContent(entity.Type, textBelow, ImageType.Png);

        string fileName = $"{entity.Name.RemoveSpecialChar()}_{entity.Type}.png";
        string container = $"/{BlobFolder.ContentQrCode}/{fileName}";
        string blobName = await _blobService.UploadDocument(container, base64CodeImage);

        entity.HashUrl = hashUrl;
        entity.QrCodePath = blobName;

        return entity;
    }
}