package com.saltedge;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.util.concurrent.Executors;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import static com.saltedge.HttpWebServer.PATH_SEGMENT;

public class HttpWebServer {
  public static final String PATH_SEGMENT = "/callback"; // Callback path segment

  public static void main(String[] args) throws IOException {
    InetSocketAddress addr = new InetSocketAddress(8082);
    HttpServer server = HttpServer.create(addr, 0);

    server.createContext(PATH_SEGMENT, new RequestHandler());
    server.setExecutor(Executors.newCachedThreadPool());
    server.start();
    System.out.println("Server is listening on port 8082");
  }
}

class RequestHandler implements HttpHandler {
  public void handle(HttpExchange exchange) throws IOException {
      String requestMethod = exchange.getRequestMethod();

    if (requestMethod.equalsIgnoreCase("POST")) {
      Headers responseHeaders = exchange.getResponseHeaders();
      responseHeaders.set("Content-Type", "application/json");
      exchange.sendResponseHeaders(200, 0);

      Headers requestHeaders = exchange.getRequestHeaders();
      InputStream is = exchange.getRequestBody();
      String callbackBody = new String(is.readAllBytes(), StandardCharsets.UTF_8);
      String signature = requestHeaders.get("Signature").toString().replaceAll("[\\[\\]]", "");

      verifySignature(callbackBody, signature);
    }
  }

  private static void verifySignature(String callbackBody, String signature) {
    String callbackUrl = "URL" + PATH_SEGMENT; // URL (e.g., https://123.ngrok.io)

    String data = callbackUrl + "|" + callbackBody;

    try {
      PublicKey publicKey = SignHelper.readPublicKey("public.pem", "RSA");
      System.out.println("SIGNATURE BELONGS TO SALTEDGE: " + SignHelper.verify(data, signature, publicKey));
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
