using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using MyProj.WebApi.Models;
using MyProj.WebApi.Repository;

namespace MyProj.WebApi.Validation
{
    public static class UserValidation
    {
        public static async IAsyncEnumerable<string> ValidateAsync(User user, HttpMethod method, IDbContextFactory<AuthDbContext> factory)
        {
            if (method == HttpMethod.Get || method == HttpMethod.Delete)
            {
                foreach (var error in ValidateId(user))
                {
                    yield return error;
                }
                yield break;
            }

            if (method == HttpMethod.Post)
            {
                await foreach (var error in ValidateForCreateAsync(user, factory))
                {
                    yield return error;
                }
                yield break;
            }

            if (method == HttpMethod.Put || method == HttpMethod.Patch)
            {
                await foreach (var error in ValidateForUpdateAsync(user, factory))
                {
                    yield return error;
                }
                yield break;
            }

            throw new NotSupportedException($"HTTP method {method} is not supported for user validation.");
        }

        public static IEnumerable<string> ValidatePhone(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Phone))
            {
                yield return "User phone number is required.";
            }
            else if (string.IsNullOrWhiteSpace(user.CountryCode))
            {
                yield return "User country code is required.";
            }
            else if (user.CountryCode == CountryCodes.ChinaMainland)
            {
                if (user.Phone.Length != 11 && !int.TryParse(user.Phone, out _))
                {
                    yield return "User phone number is invalid.";
                }
            }
            else
            {
                yield return "The country code is not supported";
            }
        }

        public static IEnumerable<string> ValidateWeChatOpenId(User user)
        {
            if (string.IsNullOrWhiteSpace(user.WeChatOpenId))
            {
                yield return "User WeChat open ID is required.";
            }
            else if (user.WeChatOpenId.Length != 28)
            {
                yield return "User WeChat open ID is invalid.";
            }
        }

        private static async IAsyncEnumerable<string> ValidateForUpdateAsync(User user, IDbContextFactory<AuthDbContext> factory)
        {
            using var context = factory.CreateDbContext();
            var queryable = context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(user.Name))
            {
                if (user.Name.Length > 100)
                {
                    yield return "User name must not exceed 100 characters.";
                }
                else if (await queryable.AnyAsync(u => u.Name == user.Name && u.Id != user.Id))
                {
                    yield return "User name must be unique.";
                }
            }

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                if (user.Email.Length > 100)
                {
                    yield return "User email must not exceed 100 characters.";
                }
                else if (!new EmailAddressAttribute().IsValid(user.Email))
                {
                    yield return "User email must be a valid email address.";
                }
                else if (await queryable.AnyAsync(u => u.Email == user.Email && u.Id != user.Id))
                {
                    yield return "User email must be unique.";
                }
            }

            if (!string.IsNullOrWhiteSpace(user.AvatarUrl) && user.AvatarUrl.Length > 1000)
            {
                yield return "Avatar URL must not exceed 1000 characters.";
            }
        }

        private static async IAsyncEnumerable<string> ValidateForCreateAsync(User user, IDbContextFactory<AuthDbContext> factory)
        {
            using var context = factory.CreateDbContext();
            var queryable = context.Users.AsQueryable();

            if (string.IsNullOrWhiteSpace(user.Name))
            {
                yield return "User name is required.";
            }
            else if (user.Name.Length > 100)
            {
                yield return "User name must not exceed 100 characters.";
            }
            else if (await queryable.AnyAsync(u => u.Name == user.Name))
            {
                yield return "User name must be unique.";
            }

            if (string.IsNullOrWhiteSpace(user.Email))
            {
                yield return "User email is required.";
            }
            else if (user.Email.Length > 100)
            {
                yield return "User email must not exceed 100 characters.";
            }
            else if (!new EmailAddressAttribute().IsValid(user.Email))
            {
                yield return "User email must be a valid email address.";
            }
            else if (await queryable.AnyAsync(u => u.Email == user.Email))
            {
                yield return "User email must be unique.";
            }

            if (!string.IsNullOrWhiteSpace(user.AvatarUrl) && user.AvatarUrl.Length > 1000)
            {
                yield return "Avatar URL must not exceed 1000 characters.";
            }
        }

        private static IEnumerable<string> ValidateId(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Id))
            {
                yield return "User ID is required.";
            }
            else if (user.Id.Length != 36 || !Guid.TryParse(user.Id, out _))
            {
                yield return "User ID must be a valid UUID.";
            }
        }
    }
}
