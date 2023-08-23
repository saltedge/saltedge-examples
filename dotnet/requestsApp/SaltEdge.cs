using System;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SESample
{
    class SaltEdge
    {
        const int REQUEST_EXPIRES_MINUTES = 3;
        const string APP_ID = "123";
        const string SECRET = "123";
        const string PRIVATE_KEY_PATH = @"keys/private.pem";

        private static RSA PRIVATE_KEY;
        private static readonly HttpClient client = new HttpClient();

        static SaltEdge()
        {
            PRIVATE_KEY = RSA.Create();
            PRIVATE_KEY.ImportFromPem(File.ReadAllText(PRIVATE_KEY_PATH));
        }

        public static async Task<string> getAsync(String url)
        {
            int expires = generateExpiresAt();
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("App-id", APP_ID);
            client.DefaultRequestHeaders.Add("Secret", SECRET);
            client.DefaultRequestHeaders.Add("Expires-at", expires.ToString());
            client.DefaultRequestHeaders.Add("Signature", generateSignature("GET", expires, url, ""));

            HttpResponseMessage response = await client.GetAsync(url);
            return await response.Content.ReadAsStringAsync();
        }

        public static async Task<string> postAsync(String url, object payload)
        {
            int expires = generateExpiresAt();
            string json = JsonSerializer.Serialize(payload);

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            request.Headers.Add("App-id", APP_ID);
            request.Headers.Add("Secret", SECRET);
            request.Headers.Add("Expires-at", expires.ToString());
            request.Headers.Add("Signature", generateSignature("POST", expires, url, json));

            HttpResponseMessage response = await client.SendAsync(request);
            return await response.Content.ReadAsStringAsync();
        }

        private static int generateExpiresAt()
        {
            DateTime unixBegin = new DateTime(1970, 1, 1);
            return (Int32)DateTime.UtcNow.AddMinutes(REQUEST_EXPIRES_MINUTES).Subtract(unixBegin).TotalSeconds;
        }

        private static string generateSignature(string method, int expires, string url, string postBody = "")
        {
            string signature = $"{expires}|{method}|{url}|{postBody}";
            byte[] dataToSign = Encoding.UTF8.GetBytes(signature);

            using (var sha256 = SHA256.Create())
            {
                var hash = sha256.ComputeHash(dataToSign);
                var signedHash = PRIVATE_KEY.SignHash(hash, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
                return Convert.ToBase64String(signedHash);
            }
        }
    }
}
