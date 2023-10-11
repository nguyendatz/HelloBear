using HelloBear.Domain.Common;

namespace HelloBear.Domain.Entities;

public class PushAndListen : BaseAuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public int ContentId { get; set; }

    public string AudioFileUrl { get; set; } = string.Empty;

    public int StartX { get; set; }

    public int StartY { get; set; }

    public int EndX { get; set; }

    public int EndY { get; set; }

    public int OriginalWidth { get; set; }

    public int OriginalHeight { get; set; }

    public Content Content { get; set; }
}
