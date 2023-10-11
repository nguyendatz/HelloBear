using QrCodeGenerator = HelloBear.Application.Settings.AppConstants.QrCodeGenerator;
using HelloBear.Domain.Enums;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using static QRCoder.Base64QRCode;

namespace HelloBear.Application.Common.Extensions;

public static class QrCodeExtensions
{
    public static string GenerateQrCodeClass(this string urlClass, ImageType imageType = ImageType.Png)
    {
        Bitmap qrCodeBmp = urlClass.GenerateQrCode();

        Bitmap combinedImage = qrCodeBmp.CombineTextToImage(urlClass);
        
        string base64CodeImage = combinedImage.ToBase64(imageType);

        return base64CodeImage;
    }

    public static string GenerateQrCodeContent(this string urlContent, ContentType contentType, string textBelow = "", ImageType imageType = ImageType.Png)
    {
        Bitmap logo = GetBitmapFromContentType(contentType);
        Bitmap qrCodeBmp = urlContent.GenerateQrCode(logo);

        Bitmap combinedImage = qrCodeBmp.CombineTextToImage(urlContent);
        if (!string.IsNullOrEmpty(textBelow))
        {
            combinedImage = combinedImage.CombineTextToImage(textBelow);
        }

        string base64CodeImage = combinedImage.ToBase64(imageType);

        return base64CodeImage;
    }

    public static Bitmap GenerateQrCode(this string dataToEncode, Bitmap? logo = null)
    {
        using QRCodeGenerator qrGenerator = new QRCodeGenerator();

        using QRCodeData qrCodeData = qrGenerator.CreateQrCode(dataToEncode, QRCodeGenerator.ECCLevel.Q);
        using QRCode qrCode = new QRCode(qrCodeData);
        Bitmap qrCodeBmp;

        if (logo is not null)
        {
            qrCodeBmp = qrCode.GetGraphic(QrCodeGenerator.PixelPerModule, QrCodeGenerator.MainColor, Color.White, logo, QrCodeGenerator.IconSizePercent, QrCodeGenerator.IconBorderWidth, QrCodeGenerator.DrawQuiteZones, Color.White);
        }
        else
        {
            qrCodeBmp = qrCode.GetGraphic(QrCodeGenerator.PixelPerModule, QrCodeGenerator.MainColor, Color.White, QrCodeGenerator.DrawQuiteZones);
        }
        return qrCodeBmp;
    }

    public static Bitmap CombineTextToImage(this Bitmap bitmap, string text)
    {
        // Combine QR code image and URL text
        Bitmap combinedImage = new Bitmap(bitmap.Width, bitmap.Height + 30); // Add extra height for the URL text
        
        using (Graphics graphics = Graphics.FromImage(combinedImage))
        {
            graphics.DrawImage(bitmap, new Point(0, 0));

            // Set font and brush for the text
            Font font = new Font("Arial", 10);
            Brush brush = new SolidBrush(QrCodeGenerator.MainColor);

            // Calculate the position to center the text below the QR code
            float x = (combinedImage.Width - graphics.MeasureString(text, font).Width) / 2;
            float y = bitmap.Height + 10; // Adjust the spacing between QR code and text as needed

            // Draw the URL text on the image
            graphics.DrawString(text, font, brush, x, y);
        }
        return combinedImage;
    }

    public static string ToBase64(this Bitmap bitmap, ImageType imgType)
    {
        ImageFormat iFormat;
        switch (imgType)
        {
            case ImageType.Png:
                iFormat = ImageFormat.Png;
                break;
            case ImageType.Jpeg:
                iFormat = ImageFormat.Jpeg;
                break;
            case ImageType.Gif:
                iFormat = ImageFormat.Gif;
                break;
            default:
                iFormat = ImageFormat.Png;
                break;
        }

        using MemoryStream memoryStream = new MemoryStream();
        bitmap.Save(memoryStream, iFormat);
        return Convert.ToBase64String(memoryStream.ToArray(), Base64FormattingOptions.None);
    }

    private static Bitmap GetBitmapFromContentType(ContentType contentType) => contentType switch
    {
        ContentType.Read => new Bitmap(QrCodeGenerator.ReadIconFilePath),
        ContentType.Music => new Bitmap(QrCodeGenerator.MusicIconFilePath),
        ContentType.Video => new Bitmap(QrCodeGenerator.VideoIconFilePath),
        ContentType.Game => new Bitmap(QrCodeGenerator.GameIconFilePath),
        ContentType.PushAndListen => new Bitmap(QrCodeGenerator.PushAndListenIconFilePath),
        ContentType.Record => new Bitmap(QrCodeGenerator.RecordFilePath),
        _ => throw new ArgumentOutOfRangeException(nameof(contentType), $"Not expected direction value: {contentType}")
    };
}