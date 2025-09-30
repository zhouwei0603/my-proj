using System.Text.Json.Serialization;

namespace MyProj.WebApi.Models
{
    public record WeChatJsCode2SessionResponse: WeChatResponse
    {
        [JsonPropertyName("session_key")]
        public string SessionKey { get; set; } = null!;

        [JsonPropertyName("unionid")]
        public string UnionId { get; set; } = null!;

        [JsonPropertyName("openid")]
        public string OpenId { get; set; } = null!;
    }
}
