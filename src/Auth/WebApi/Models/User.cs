using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace MyProj.WebApi.Models
{
    [Table("user")]
    public record User
    {
        [Key]
        [Column("id")]
        [JsonPropertyName("id")]
        [ValidateNever]
        public string Id { get; set; } = null!;

        [Column("name")]
        [JsonPropertyName("name")]
        public string Name { get; set; } = null!;

        [Column("email")]
        [JsonPropertyName("email")]
        public string Email { get; set; } = null!;

        [Column("avatar_url")]
        [JsonPropertyName("avatarUrl")]
        public string? AvatarUrl { get; set; }
    }
}
