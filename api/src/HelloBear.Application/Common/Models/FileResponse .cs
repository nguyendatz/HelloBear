﻿namespace HelloBear.Application.Common.Models;
public record FileResponse(byte[] Content, string ContentType, string FileName);