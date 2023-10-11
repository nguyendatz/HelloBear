using HelloBear.Application.Common.Interfaces;
using HelloBear.Domain.Entities;

namespace HelloBear.Application.Classes.Shared.Services;

public interface IClassService : IScopedService
{
    Task<Class> GenerateQrCode(Class entity);
    Task<string> EncodeClassHashCode(int classId);
    Task<int> DecodeClassHashCode(string hashCode);
}
