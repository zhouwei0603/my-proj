using System.Text.Json.Serialization;

namespace MyProj.WebApi.Models
{
    public record WeChatResponse
    {
        [JsonPropertyName("errmsg")]
        public string? ErrorMessage { get; set; }

        [JsonPropertyName("errcode")]
        public int? ErrorCode { get; set; }
    }
}
