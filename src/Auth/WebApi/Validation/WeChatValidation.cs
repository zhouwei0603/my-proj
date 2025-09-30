namespace MyProj.WebApi.Validation
{
    public static class WeChatValidation
    {
        public static IEnumerable<string> ValidateCode(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                yield return "WeChat code is required.";
            }
        }
    }
}
