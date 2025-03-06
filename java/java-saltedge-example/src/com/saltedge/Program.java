package com.saltedge;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class Program {
  public static void main(String[] arg) {
    // This is an example of a POST request with/ a payload. Keep in mind the serialized payload
    // is also taken into account when computing the signature.
    String str = "{ \"data\": {\"identifier\": \"javaTestCustom\" }}";
    JsonElement jelement = new JsonParser().parse(str);
    JsonObject jobject = jelement.getAsJsonObject();
    System.out.println("POST request: \n" + new SaltEdge().post("https://www.saltedge.com/api/v6/customers", jobject));

    // GET request example:
    System.out.println("\nGET request: \n" + new SaltEdge().get("https://www.saltedge.com/api/v6/countries"));
  }
}
