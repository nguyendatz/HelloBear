using HelloBear.Application.Common.Enums;
using Microsoft.AspNetCore.Http;

namespace HelloBear.Application.Common.Interfaces;

public interface IBlobService : IScopedService
{
    Task<string> UploadDocument(string blobIdentifier, byte[] blobData);
    Task<string> UploadDocument(string blobIdentifier, string blobDataBase64);
    Task<string> UploadFile(IFormFile file, BlobFolder folder);
    Task DeleteFile(string fileName, BlobFolder folder);
    List<KeyValuePair<string, byte[]>> GetBlobData(List<string> blobIdentifiers);
}