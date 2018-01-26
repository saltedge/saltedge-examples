package com.saltedge;


public class Program {

    public static void main (String[] arg) {
    	System.out.println(new SaltEdge().get("https://www.saltedge.com/api/v4/countries"));
    	// This is an example of a post request with a payload. Keep in mind the the serialized payload
        // is also taken into account when computing the signature.
//
//        String str = "{ \"data\": {\"identifier\": \"javaTestCustomer\" }}";
//
//        JsonElement jelement = new JsonParser().parse(str);
//        JsonObject jobject = jelement.getAsJsonObject();
//
//        System.out.println(new SaltEdge().post("https://www.saltedge.com/api/v4/customers", jobject));
    }
}
