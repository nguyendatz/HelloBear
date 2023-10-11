using HashidsNet;
using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Settings;
using HelloBear.Domain.Entities;
using Microsoft.Extensions.Options;
using static QRCoder.Base64QRCode;

namespace HelloBear.Application.Classes.Shared.Services;

public class ClassSevice : IClassService
{
    private readonly IBlobService _blobService;
    private readonly SystemSetting _systemSetting;

    public ClassSevice(IBlobService blobService, IOptions<SystemSetting> systemSetting)
    {
        _systemSetting = systemSetting.Value;
        _blobService = blobService;
    }

    public async Task<int> DecodeClassHashCode(string hashCode)
    {
        var hashids = new Hashids(_systemSetting.Salt, AppConstants.HashLength);
        int classId = hashids.DecodeSingle(hashCode);
        return classId;
    }

    public async Task<Class> GenerateQrCode(Class entity)
    {
        // build hash url
        var hashids = new Hashids(_systemSetting.Salt, AppConstants.HashLength);
        string hash = hashids.Encode(entity.Id);
        string hashUrl = $"{_systemSetting.ClientAppBaseUrl}{_systemSetting.ClientAppStudentClassPath}/{hash}";

        // generate qrcode
        string base64CodeImage = hashUrl.GenerateQrCodeClass(ImageType.Png);
        string container = $"/{BlobFolder.ClassQrCode}/{DateTime.Now.Ticks.GetHashCode().ToString("x").ToUpper()}.png";
        string blobName = await _blobService.UploadDocument(container, base64CodeImage);

        entity.HashUrl = hashUrl;
        entity.QrCodePath = blobName;

        return entity;
    }

    public async Task<string> EncodeClassHashCode(int classId)
    {
        var hashids = new Hashids(_systemSetting.Salt, AppConstants.HashLength);
        string hash = hashids.Encode(classId);
        return hash;
    }
}