using System.Reflection;
using System.Text.Json.Serialization;
using MyProj.WebApi.Models;

namespace MyProj.WebApi.Validation
{
    public static class PaginationValidation
    {
        public static IEnumerable<string> Validate<T>(Pagination pagination)
        {
            if (pagination.Page < 0)
            {
                yield return $"{nameof(pagination.Page)} must be greater than or equal to 0.";
            }

            if (pagination.PageSize <= 0)
            {
                yield return $"{nameof(pagination.PageSize)} must be greater than 0.";
            }
            else if (pagination.PageSize > 100)
            {
                yield return $"{nameof(pagination.PageSize)} must be less than or equal to 100.";
            }

            if (!string.IsNullOrEmpty(pagination.OrderBy))
            {
                var fields = pagination.OrderBy.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                if (fields.Length > 2)
                {
                    yield return $"{nameof(pagination.OrderBy)} must be in the format 'field direction'.";
                }
                else
                {
                    var orderField = fields[0];
                    var orderDirection = fields.Length > 1 ? fields[1].ToLower() : "asc";
                    var validFields = typeof(T).GetProperties().Select(p =>
                    {
                        var jsonProp = p.GetCustomAttribute<JsonPropertyNameAttribute>();
                        return jsonProp != null ? jsonProp.Name.ToLower() : p.Name.ToLower();
                    }).ToHashSet();

                    if (!validFields.Contains(orderField.ToLower()))
                    {
                        yield return $"{nameof(pagination.OrderBy)} field '{orderField}' is not valid.";
                    }
                    if (orderDirection != "asc" && orderDirection != "desc")
                    {
                        yield return $"{nameof(pagination.OrderBy)} direction must be either 'asc' or 'desc'.";
                    }
                }
            }
        }
    }
}
