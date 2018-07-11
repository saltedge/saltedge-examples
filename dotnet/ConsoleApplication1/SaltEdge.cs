using System;
using System.Net;
using System.IO;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.OpenSsl;
using Org.BouncyCastle.Security;
using Newtonsoft.Json;

namespace SESample
{
    class Callback
    {
        private RsaKeyParameters publicKey;

        public Callback(String publicKeyPath) {
            publicKey = readPublicKey(publicKeyPath);
        }

        public bool verify(String url, String requestBody, String signature) {
            ISigner sig = SignerUtilities.GetSigner("SHA256withRSA");
            sig.Init(false, publicKey);

            String input = string.Format("{0}|{1}", url, requestBody);
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(input);

            byte[] decodedSignature = Convert.FromBase64String(signature);

            sig.BlockUpdate(bytes, 0, bytes.Length);
            return sig.VerifySignature(decodedSignature);
        }

        private RsaKeyParameters readPublicKey(string fileName)
        {
            RsaKeyParameters keyPair;

            using (var reader = File.OpenText(fileName))
                keyPair = (RsaKeyParameters)new PemReader(reader).ReadObject();

            return keyPair;
        }
    }

    class SaltEdge
    {
        const int REQUEST_EXPIRES_MINUTES = 3;
        const string APP_ID           = "APP_ID";
        const string SECRET           = "SECRET";
        const string PRIVATE_KEY_PATH = @"c:\keys\private.pem";

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

            return execute(request);
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

            return execute(request);
        }

        private static WebRequest buildRequest(string method, string url)
        {
            WebRequest request = WebRequest.Create(url);

            request.Method = method;
            request.Headers["App-id"] = APP_ID;
            request.Headers["Secret"] = SECRET;
            request.ContentType = "application/json";

            return request;
        }

        private static int generateExpiresAt()
        {
            DateTime unixBegin = new DateTime(1970, 1, 1);
            return (Int32)DateTime.UtcNow.AddMinutes(REQUEST_EXPIRES_MINUTES).Subtract(unixBegin).TotalSeconds;
        }

        private static string execute(WebRequest request)
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

            return process(response);
        }

        private static string process(WebResponse response) {
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
            ISigner sig = SignerUtilities.GetSigner("SHA256withRSA");
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
