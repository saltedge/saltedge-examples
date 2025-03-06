package com.saltedge;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;

public class Program {
    static public final String SPECTRE_PUBLIC_KEY_PATH = "saltedge_public.pem";
    static public final String PUBLIC_KEY_ALGORITHM = "RSA";
    static public final String PUBLIC_KEY_PATH = "public.pem";
    // HTTP_SIGNATURE header
    static public final String SIGNATURE = "SIGNATURE"; // e.g. "E9ZuBqpo52sX4Wjbeve4/JD/HzDFeRndnSZ7rn9b1Ljj9FLDGQjakdGhJDuTX/2jeB+PL2Yf6NmwyvS/qe5DJcYETnHyFbsIAqLAnj/kJpC9YDe4mO4lKZQeY/1gsRiEi+G+WH9lrLywgev2zivzOCjRQ8nTg0iqLci4hSYyfoBi2cqfF0GJk5+IJaTRqixMNk0Gd6EQN4ZbEARlmGQsmp0m+lEoxEGfqJNuqfIjmB5QZVRVHmvKuhg8AXbLJYThexhFoZoX35u2w0EuQ44DUrGo9Afy7qUHiVlL059/oG3BlKsgrDeCyDJzWYKsvaYYNgjth6XPWcv5C2crM/kiLw==";

    public static void main(String[] arg) {
        System.out.println(new SaltEdge().get("https://www.saltedge.com/api/v6/countries"));
        verifySignature(); // signature verifiction flow on callback

//        This is an example of a post request with a payload. Keep in mind the the serialized payload
//        is also taken into account when computing the signature.
//
//        String str = "{ \"data\": {\"identifier\": \"javaTestCustomer\" }}";
//
//        JsonElement jelement = new JsonParser().parse(str);
//        JsonObject jobject = jelement.getAsJsonObject();
//
//        System.out.println(new SaltEdge().post("https://www.saltedge.com/api/v6/customers", jobject));
    }

    private static void verifySignature() {
        String callbackUrl = "URL"; // e.g. https://872ce257.ngrok.io/callback";
        String callbackBody = "BODY"; // e.g. "{\"data\":{\"connection_id\":\"990002\",\"customer_id\":\"802512\",\"custom_fields\":{}},\"meta\":{\"version\":\"6\",\"time\":\"2025-01-18T14:05:01.130Z\"}}";

        String data = callbackUrl + "|" + callbackBody;

        try {
            PublicKey publicKey = SignHelper.readPublicKey(PUBLIC_KEY_PATH, PUBLIC_KEY_ALGORITHM);
            System.out.println("SIGNATURE BELONGS TO SALTEDGE: " + SignHelper.verify(data, SIGNATURE, publicKey));
        } catch (IOException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeySpecException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
