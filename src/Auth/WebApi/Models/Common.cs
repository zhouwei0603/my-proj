using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace MyProj.WebApi.Models
{
    public enum OrderByDirection
    {
        Ascending = 1,
        Descending = 2
    }

    public record Pagination
    {
        [FromQuery(Name = "start")]
        public int Page { get; set; } = 0;

        [FromQuery(Name = "size")]
        public int PageSize { get; set; } = 10;

        [FromQuery(Name = "search")]
        public string? Search { get; set; }

        [FromQuery(Name = "orderBy")]
        public string? OrderBy { get; set; }
    }

    public record PagedResult<T>
    {
        [JsonPropertyName("total")]
        public int Total { get; set; }

        [JsonPropertyName("value")]
        public IEnumerable<T> Items { get; set; } = [];
    }

    public static class CountryCodes
    {
        public static readonly string ChinaMainland = "86";
    }
}