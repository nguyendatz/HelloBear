using HelloBear.Application.Common.Interfaces;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Contents.Shared.Services;

public interface IContentService : IScopedService
{
    Task<Content> GenerateQrCode(Content entity, string bookCode);
}