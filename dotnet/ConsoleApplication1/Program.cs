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
            System.Console.WriteLine(SaltEdge.get("https://www.saltedge.com/api/v4/countries"));

            // This is an example of a post request with a payload. Keep in mind the the serialized payload
            // is also taken into account when computing the signature.
            //
            // var payload = new {
            //     data = new {
            //         identifier = "12rv1212f1efxchsdhbgv"
            //     }
            // };
            //
            // string result = SaltEdge.post("https://www.saltedge.com/api/v4/customers/", payload);
            // System.Console.WriteLine(result);

            // This is an example of callback signature verification
            //
            // String url = "http://5c258d2d.ngrok.io/callback";
            // String body = "{\"data\":{\"login_id\":\"1970810\",\"customer_id\":\"367201\",\"custom_fields\":{}},\"meta\":{\"version\":\"4\",\"time\":\"2018-07-11T09:05:35.194Z\"}}";
            // String signature = "W9FdINUMNASfJJmS4lMUcMx3t+lRvbcEvqdwOy2mWwqTKvaMC5saAIMJFEXItLRh5XpL1CtUGOiKnpBC68xcqI/Grlf4hQ6Yf05GXuji/phQ8MrTqmIoAz6O41H1I5IPaYbgWO62SwD4pEMD/tSeUlZX80IJ1gOPD1Uj5qnbySxHC2pWgziIxvh9kAt+JxP2Irm1WsVak8RMvbXZj7FkpdsLJuJCW3PIeNMnN9tEBJr2dqjje058PK52Se7tVE6mbQl71pmnwOo2d9OehHZJBiuBu0Ri4/jxgpETu83tOkoh8X1N7D/sGGkv3mFs4stp0ErQaTGPbg2UVNxVMuH2dg==";
            //
            // NOTE: spectre_public.pem is from https://docs.saltedge.com/guides/callbacks/
            //
            // Callback callback = new Callback(@"C:\keys\spectre_public.pem");
            // System.Console.WriteLine(callback.verify(url, body, signature));
            //
            System.Console.ReadKey();
        }
    }
}
