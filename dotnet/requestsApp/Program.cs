using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SESample
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // *********************************
            // ****** GET request example ******
            // *********************************

            System.Console.WriteLine(await SaltEdge.getAsync("http://localhost:5000/api/v5/countries"));



            // **********************************
            // ****** POST request example ******
            // **********************************

            // This is an example of a post request with a payload. Keep in mind the the serialized payload
            // is also taken into account when computing the signature.
            //
            // var payload = new {
            //     data = new {
            //         identifier = "bbbbjjjj12rv1212f1efxchsdhbgv"
            //     }
            // };

            // string result = await SaltEdge.postAsync("http://localhost:5000/api/v5/customers/", payload);
            // System.Console.WriteLine(result);
            System.Console.ReadKey();
        }
    }
}
