using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Security.Cryptography;
using Org.BouncyCastle.Crypto;
using System.IO;
using Org.BouncyCastle.Crypto.Encodings;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Crypto.Engines;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Crypto.Digests;
using Org.BouncyCastle.Security;
using Newtonsoft.Json;

namespace SESample
{
    class SaltEdge
    {
        const int REQUEST_EXPIRES_MINUTES = 3;
        const string CLIENT_ID            = "CLIENT_ID";
        const string SERIVICE_SECRET      = "CLIENT_SECRET";
        const string PRIVATE_KEY_PATH     = @"c:\keys\tt.pem";

        private static AsymmetricKeyParameter PRIVATE_KEY = null;

        static SaltEdge()
        {
            PRIVATE_KEY = readPrivateKey(PRIVATE_KEY_PATH);
        }

        public static string get(String url) {
            WebRequest request              = buildRequest("GET", url);
            int expires                     = generateExpiresAt();
            request.Headers["Signature"]    = generateSignature("GET", expires, url, "");
            request.Headers["Expires-at"]   = expires.ToString();

            return processResponse(request);
        }

        public static string post(String url, object payload)
        {
            WebRequest request = buildRequest("POST", url);
            int expires = generateExpiresAt();

            request.Headers["Expires-at"] = expires.ToString();

            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                string json = JsonConvert.SerializeObject(payload);
                streamWriter.Write(json);
                request.Headers["Signature"] = generateSignature("POST", expires, url, json);
            }

            return processResponse(request);
        }

        private static WebRequest buildRequest(string method, string url)
        {
            WebRequest request = WebRequest.Create(url);

            request.Method = method;
            request.Headers["Client-id"] = CLIENT_ID;
            request.Headers["Service-secret"] = SERIVICE_SECRET;
            request.ContentType = "application/json";

            return request;
        }

        private static int generateExpiresAt()
        {
            DateTime unixBegin = new DateTime(1970, 1, 1);
            return (Int32)DateTime.UtcNow.AddMinutes(REQUEST_EXPIRES_MINUTES).Subtract(unixBegin).TotalSeconds;
        }

        private static string processResponse(WebRequest request)
        {
            WebResponse response;

            try
            {
                response = request.GetResponse();
            }
            catch (WebException e)
            {
                Console.WriteLine("{0}\n{1}", e.Response, e.Response.ToString());
                response = e.Response;
            }

            using (System.IO.Stream s = response.GetResponseStream())
            {
                using (System.IO.StreamReader sr = new System.IO.StreamReader(s))
                {
                    return sr.ReadToEnd();
                }
            }
        }

        private static string generateSignature(string method, int expires, string url, string postBody="")
        {
            string signature    = string.Format("{0}|{1}|{2}|{3}", expires, method, url, postBody);
            byte[] bytes        = System.Text.Encoding.UTF8.GetBytes(signature);
            byte[] shaSignature = sign(bytes);

            return Convert.ToBase64String(shaSignature);
        }

        private static byte[] sign(byte[] bytes)
        {
            ISigner sig = SignerUtilities.GetSigner("SHA1withRSA");
            sig.Init(true, PRIVATE_KEY);
            sig.BlockUpdate(bytes, 0, bytes.Length);
            return sig.GenerateSignature();
        }

        private static AsymmetricKeyParameter readPrivateKey(string privateKeyFileName)
        {
            AsymmetricCipherKeyPair keyPair;

            using (var reader = File.OpenText(privateKeyFileName))
                keyPair = (AsymmetricCipherKeyPair)new PemReader(reader).ReadObject();

            return keyPair.Private;
        }
    }
}
