using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Security.Cryptography;
using System.Text;
using System.IO;

namespace callbackServer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CallbackController : ControllerBase
{
    [HttpPost("{type}")]     // api/callback/:type
    public async Task<IActionResult> Post(string type)
    {
        using StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8);
        string body = await reader.ReadToEndAsync();

        string fullUrl = $"{Request.Scheme}://{Request.Host}{Request.Path}";

        string? requestSignature = Request.Headers["Signature"];

        if (requestSignature == null) {
            Console.WriteLine("No Signature in the request");
            Console.WriteLine("Skipping verification");
            return Ok();
        }

        if (!VerifySignature(fullUrl, Request.Method, body, requestSignature))
        {
            Console.WriteLine("Signature verification failed!");
            return BadRequest();
        }

        Console.WriteLine();
        Console.WriteLine("========Signature verified=========");
        Console.WriteLine("===================================");
        Console.WriteLine("=========== RESPONSE ==============");
        Console.WriteLine($"=========== {type} ===============");
        Console.WriteLine("===================================");
        Console.WriteLine(body);
        Console.WriteLine("===================================");
        Console.WriteLine();

        return Ok();
    }

    private bool VerifySignature(string url, string method, string data, string signature)
    {
        using RSA publicKey = RSA.Create();
        publicKey.ImportFromPem(System.IO.File.ReadAllText(@"keys/public.pem"));

        byte[] dataBytes = Encoding.UTF8.GetBytes($"{url}|{data}");
        byte[] signatureBytes = Convert.FromBase64String(signature);

        return publicKey.VerifyData(dataBytes, signatureBytes, HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);
    }
}
