using HelloBear.Application.Common.Enums;

namespace HelloBear.Application.Common.Models;
public class UploadVideoResponse
{
    public UploadVideoStatus Status { get; set; }

    public long BytesSent { get; set; }

    public string? Exception { get; set; }

    public string? Link { get; set; }
}
