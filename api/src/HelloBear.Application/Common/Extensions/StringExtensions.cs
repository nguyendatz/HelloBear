using System.Text.RegularExpressions;

namespace HelloBear.Application.Common.Extensions;

public static class StringExtensions
{
    public static string RemoveSpecialChar(this string text)
    {
        return Regex.Replace(text, @"[^0-9a-zA-Z/]+", string.Empty);
    }
}