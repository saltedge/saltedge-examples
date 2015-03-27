package com.saltedge;

public class Program {

    public static void main (String[] arg) {
    	System.out.println(new SaltEdge().get("https://www.saltedge.com/api/v2/countries"));
    	// This is an example of a post request with a payload. Keep in mind the the serialized payload
        // is also taken into account when computing the signature.
        
//         var payload = new {
//             data = new {
//                 identifier = "12rv1212f1efxchsdhbgv"
//             }
//         };
//        
//    	System.out.println(SaltEdge.post("https://www.saltedge.com/api/v2/customers/", payload));
    }
}
