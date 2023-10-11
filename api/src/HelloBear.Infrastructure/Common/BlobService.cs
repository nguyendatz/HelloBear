using Azure.Storage.Blobs;
using HelloBear.Application.Common.Enums;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace HelloBear.Infrastructure.Common;

public class BlobService : IBlobService
{
    private readonly BlobStorageSettings _blobStorageSettings;
    private readonly BlobStorageConnectionSettings _blobStorageConnectionSettings;

    public BlobService(
        IOptions<BlobStorageSettings> blobStorageSettings,
        IOptions<BlobStorageConnectionSettings> blobConnectionSettings)
    {
        _blobStorageSettings = blobStorageSettings.Value;
        _blobStorageConnectionSettings = blobConnectionSettings.Value;
    }

    public async Task<string> UploadDocument(string blobIdentifier, byte[] blobData)
    {
        BlobClient blobClient = GetClient(blobIdentifier);
        if (blobClient.Exists())
        {
            return blobIdentifier;
        }

        using var stream = new MemoryStream(blobData);
        await blobClient.UploadAsync(stream);
        return blobIdentifier;
    }

    public async Task<string> UploadDocument(string blobIdentifier, string blobDataBase64)
    {
        BlobClient blobClient = GetClient(blobIdentifier);
        if (blobClient.Exists())
        {
            return blobIdentifier;
        }

        byte[] buffer = Convert.FromBase64String(blobDataBase64);
        using MemoryStream stream = new MemoryStream(buffer);

        await blobClient.UploadAsync(stream);
        return blobIdentifier;
    }

    public async Task<string> UploadFile(IFormFile file, BlobFolder folder)
    {
        var fileName = $"{folder}/{DateTime.Now.Ticks.GetHashCode().ToString("x").ToUpper()}{Path.GetExtension(file.FileName)}";
        var client = GetClient(fileName);
        using var data = file.OpenReadStream();
        await client.UploadAsync(data);
        return fileName;
    }

    public async Task DeleteFile(string fileName, BlobFolder folder)
    {
        var path = $"{folder}/{fileName}";
        var client = GetClient(path);
        await client.DeleteAsync();
    }

    public List<KeyValuePair<string, byte[]>> GetBlobData(List<string> blobIdentifiers)
    {
        List<KeyValuePair<string, byte[]>> result = new();

        BlobServiceClient blobServiceClient = new(_blobStorageConnectionSettings.BlobStorageConnection);
        BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(_blobStorageSettings.BlobContainerName);

        foreach(var blobIdentifier in blobIdentifiers)
        {
            BlobClient blobClient = containerClient.GetBlobClient(blobIdentifier);
            if (!(bool)blobClient.Exists())
            {
                continue;
            }

            using MemoryStream memoryStream = new MemoryStream();
            blobClient.DownloadTo(memoryStream);

            result.Add(new KeyValuePair<string, byte[]>(blobIdentifier, memoryStream.ToArray()));
        }

        return result;
    }


    protected BlobClient GetClient(string blobIdentifier)
    {
        BlobServiceClient blobServiceClient = new(_blobStorageConnectionSettings.BlobStorageConnection);
        BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(_blobStorageSettings.BlobContainerName);
        BlobClient blobClient = containerClient.GetBlobClient(blobIdentifier);

        return blobClient;
    }
}