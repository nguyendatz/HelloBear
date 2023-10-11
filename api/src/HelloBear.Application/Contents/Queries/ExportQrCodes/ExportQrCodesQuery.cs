using System.IO.Compression;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Contents.Queries.ExportQrCodes;

public record ExportQrCodesQuery(int LessonId) : IRequest<OperationResult<FileResponse>>;

public class ExportQrCodesQueryHandler : IRequestHandler<ExportQrCodesQuery, OperationResult<FileResponse>>
{
    private readonly IApplicationDbContext _context;
    private readonly IBlobService _blobService;

    public ExportQrCodesQueryHandler(
        IApplicationDbContext context,
        IBlobService blobService)
    {
        _context = context;
        _blobService = blobService;
    }

    public async Task<OperationResult<FileResponse>> Handle(ExportQrCodesQuery request, CancellationToken cancellationToken)
    {
        var lesson = await _context.Lessons
            .Include(l => l.TextBook)
            .FirstOrDefaultAsync(l => l.Id == request.LessonId);
        if (lesson is null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(Lesson)} with Id:{request.LessonId}");
        }

        var qrCodeFiles = _context.Contents.Where(c => c.LessonId == lesson.Id).Select(c => c.QrCodePath).ToList();

        if (!qrCodeFiles.Any())
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(Content)} with LesssId:{request.LessonId}");
        }

        var memoryStream = Compress(qrCodeFiles);
        var fileName = $"{lesson.TextBook.Name.RemoveSpecialChar()}_{lesson.Name.RemoveSpecialChar()}.zip";
        return OperationResult.Ok(new FileResponse(memoryStream, "application/zip", fileName));
    }

    private byte[] Compress(List<string> files)
    {
        var fileDataList = _blobService.GetBlobData(files);

        var memoryStream = new MemoryStream();
        using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
        {
            foreach (var file in files)
            {
                var fileKeyPair = fileDataList.Find(x => x.Key == file);
                if(string.IsNullOrEmpty(fileKeyPair.Key) || fileKeyPair.Value.Length == 0)
                {
                    continue;
                }
                
                ZipArchiveEntry entry = zipArchive.CreateEntry(Path.GetFileName(file), CompressionLevel.Fastest);
                using (Stream stream = entry.Open())
                using (var fileStream = new MemoryStream(fileKeyPair.Value))
                {
                    fileStream.Seek(0, SeekOrigin.Begin);
                    fileStream.CopyTo(stream);
                }
            }
        }

        memoryStream.Position = 0;
        return memoryStream.ToArray();
    }
}