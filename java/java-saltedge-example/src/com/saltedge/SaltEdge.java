package com.saltedge;


import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.HttpURLConnection;
import java.net.ProtocolException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Calendar;

import org.bouncycastle.util.encoders.Base64;
import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.openssl.PEMException;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

import com.google.gson.Gson;

public class SaltEdge {

    public final static int REQUEST_EXPIRES_MINUTES = 3;
    public final static String CLIENT_ID            = "CLIENT_ID";
    public final static String SERIVICE_SECRET      = "SERIVICE_SECRET";
    public final String PRIVATE_KEY_PATH     = "./res/com/saltedge/private.pem";
	private static PEMKeyPair PRIVATE_KEY = null;

	public SaltEdge() {
        PRIVATE_KEY = readPrivateKey(PRIVATE_KEY_PATH);
    }

	// HTTP GET request
	public String get(String url) {
 
		HttpURLConnection con = buildRequest("GET", url);
		if (con == null) {
			return "";
		} 
		//add request header
		int expires = generateExpiresAt();
		con.setRequestProperty("Signature", generateSignature("GET", expires, url, ""));
		con.setRequestProperty("Expires-at", String.valueOf(expires));
 
		return processResponse(con);
	}
	
	// HTTP POST request
	public String post(String url, Object payload) {
 
		HttpURLConnection con = buildRequest("POST", url);
		if (con == null) {
			return "";
		} 
		Gson gson = new Gson();
		String json = gson.toJson(payload);
		con.setDoOutput(true);
		DataOutputStream wr;
		try {
			wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(json);
			wr.flush();
			wr.close();
		} catch (IOException e) {
			System.out.println("IOException : " + e);
			e.printStackTrace();
		}
		//add request header
		int expires = generateExpiresAt();
		con.setRequestProperty("Signature", generateSignature("POST", expires, url, json));
		con.setRequestProperty("Expires-at", String.valueOf(expires));
 
		return processResponse(con);
	}
	
	private String processResponse(HttpURLConnection con) {
		BufferedReader in;
		StringBuffer response = new StringBuffer();
		try {
			in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
	 
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
		} catch (IOException e) {
			System.out.println("IOException : " + e);
			e.printStackTrace();
		}
		return response.toString();
	}
	
	private HttpURLConnection buildRequest(String method, String url)
    {
		HttpURLConnection con = null;
		try {
			URL obj = new URL(url);
			con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod(method);
			con.setRequestProperty("Client-id", CLIENT_ID);
			con.setRequestProperty("Service-secret", SERIVICE_SECRET);
			con.setRequestProperty("Content-Type", "application/json");
		} catch (ProtocolException e) {
			System.out.println("ProtocolException : " + e);
			e.printStackTrace();
		} catch (IOException e) {
			System.out.println("IOException : " + e);
			e.printStackTrace();
		}
        return con;
    }
	
	private int generateExpiresAt() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MINUTE, REQUEST_EXPIRES_MINUTES);
		return (int) (calendar.getTimeInMillis() / 1000L);
    }
	
	private String generateSignature(String method, int expires, String url, String postBody) {
        String signature    = String.format("%d|%s|%s|%s", expires, method, url, postBody);
        byte[] bytes        = signature.getBytes();
        byte[] shaSignature = null;
		try {
			shaSignature = sign(bytes);
		} catch (SignatureException e) {
			System.out.println("SignatureException : " + e);
			e.printStackTrace();
		} catch (PEMException e) {
			System.out.println("PEMException : " + e);
			e.printStackTrace();
		}

        return Base64.toBase64String(shaSignature);
    }

    private byte[] sign(byte[] bytes) throws SignatureException, PEMException {
    	  KeyPair keyPair=null;
    	  Signature signature = null;
		try {
			signature = Signature.getInstance("SHA1withRSA");
			signature.initSign(new JcaPEMKeyConverter().getPrivateKey(PRIVATE_KEY.getPrivateKeyInfo()));
			signature.update(bytes);
		} catch (NoSuchAlgorithmException e) {
			System.out.println("NoSuchAlgorithmException : " + e);
			e.printStackTrace();
		} catch (InvalidKeyException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SignatureException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}        
  	  return signature.sign(); 
    }
    
   	public PEMKeyPair readPrivateKey(String privateKeyFileName) {
   		AsymmetricCipherKeyPair keyPair = null;
        File f = new File(privateKeyFileName);
        FileReader fileReader = null;
		try {
			fileReader = new FileReader(f);
		} catch (FileNotFoundException e) {
			System.out.println("FileNotFoundException : " + e);
			e.printStackTrace();
			return null;
		}
        PEMKeyPair obj = null;
		try {
			obj = (PEMKeyPair) new PEMParser(fileReader).readObject();
		} catch (IOException e) {
			System.out.println("IOException : " + e);
			e.printStackTrace();
			return null;
		}
        return obj;

	}
}
