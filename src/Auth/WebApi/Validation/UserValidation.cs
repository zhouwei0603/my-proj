using System.ComponentModel.DataAnnotations;
using MyProj.WebApi.Models;

namespace MyProj.WebApi.Validation
{
    public static class UserValidation
    {
        public static IEnumerable<string> Validate(User user, HttpMethod method)
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
                foreach (var error in ValidateForCreate(user))
                {
                    yield return error;
                }
                yield break;
            }

            if (method == HttpMethod.Put || method == HttpMethod.Patch)
            {
                foreach (var error in ValidateForUpdate(user))
                {
                    yield return error;
                }
                yield break;
            }

            throw new NotSupportedException($"HTTP method {method} is not supported for user validation.");
        }

        private static IEnumerable<string> ValidateForUpdate(User user)
        {
            if (!string.IsNullOrWhiteSpace(user.Name))
            {
                if (user.Name.Length > 100)
                {
                    yield return "User name must not exceed 100 characters.";
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
            }

            if (!string.IsNullOrWhiteSpace(user.AvatarUrl) && user.AvatarUrl.Length > 1000)
            {
                yield return "Avatar URL must not exceed 1000 characters.";
            }
        }

        private static IEnumerable<string> ValidateForCreate(User user)
        {
            if (string.IsNullOrWhiteSpace(user.Name))
            {
                yield return "User name is required.";
            }
            else if (user.Name.Length > 100)
            {
                yield return "User name must not exceed 100 characters.";
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
