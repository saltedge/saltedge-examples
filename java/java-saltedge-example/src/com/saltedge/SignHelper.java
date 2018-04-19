package com.saltedge;

import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.util.encoders.Base64;

import java.io.*;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;

public class SignHelper {

    public static boolean verify(String plainText, String signString, PublicKey publicKey) throws Exception {
        byte[] data = plainText.getBytes("ISO-8859-1");

        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(data);

        byte[] signByte = Base64.decode(signString);
        return signature.verify(signByte);
    }

    public static PublicKey readPublicKey(String filename, String algorithm) throws Exception {
        File f = new File(filename);
        FileInputStream fis = new FileInputStream(f);
        DataInputStream dis = new DataInputStream(fis);
        byte[] keyBytes = new byte[(int) f.length()];
        dis.readFully(keyBytes);
        dis.close();

        String temp = new String(keyBytes);
        String publicKeyPEM = temp.replace("-----BEGIN PUBLIC KEY-----\n", "");
        publicKeyPEM = publicKeyPEM.replace("-----END PUBLIC KEY-----", "");

        Base64 b64 = new Base64();
        byte[] decoded = b64.decode(publicKeyPEM);

        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        KeyFactory kf = KeyFactory.getInstance(algorithm);
        return kf.generatePublic(spec);
    }

    static public PEMKeyPair readPrivateKey(String privateKeyFileName) {
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
