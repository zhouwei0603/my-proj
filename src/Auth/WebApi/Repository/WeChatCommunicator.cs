using System.Diagnostics.CodeAnalysis;
using System.Text.Json;
using MyProj.WebApi.Models;

namespace MyProj.WebApi.Repository
{
    public class WeChatCommunicator(string appId, string secret, string snsEndpoint)
    {
        public async Task<WeChatJsCode2SessionResponse> GetCode2SessionAsync(string code)
        {
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync($"{snsEndpoint}/jscode2session?appid={appId}&secret={secret}&js_code={code}&grant_type=authorization_code");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<WeChatJsCode2SessionResponse>(content);
            ValidateResponse(result);
            return result;
        }

        private static void ValidateResponse([NotNull] WeChatResponse? response)
        {
            ArgumentNullException.ThrowIfNull(response);

            if (response.ErrorCode is not null || response.ErrorMessage is not null)
            {
                throw new InvalidOperationException($"ErrorCode: {response.ErrorCode} ErrorMessage: {response.ErrorMessage}");
            }
        }
    }
}
