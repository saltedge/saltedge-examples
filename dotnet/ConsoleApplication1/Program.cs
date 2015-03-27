using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SESample
{
    class Program
    {
        static void Main(string[] args)
        {
            System.Console.WriteLine(SaltEdge.get("https://www.saltedge.com/api/v2/countries"));
            
            // This is an example of a post request with a payload. Keep in mind the the serialized payload
            // is also taken into account when computing the signature.
            //
            // var payload = new {
            //     data = new {
            //         identifier = "12rv1212f1efxchsdhbgv"
            //     }
            // };
            //
            // string result = SaltEdge.post("https://www.saltedge.com/api/v2/customers/", payload);
            // System.Console.WriteLine(result);
            System.Console.ReadKey();
        }
    }
}
