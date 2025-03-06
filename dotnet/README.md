# **Salt Edge API Integration with C#/.NET**

This repository provides examples on integrating Salt Edge API with a C#/.NET application. We cover two main aspects:
1. Making requests to Salt Edge (via **RequestsApp**).
2. Implementing callbacks with signature validation (via **CallbackServer**).

**Important**: Before you proceed, ensure you've generated the required `private.pem` and `public.pem` files. Follow the steps detailed in [SaltEdge's Signature Guide](https://docs.saltedge.com/v6/#security-signature) to do so. Once generated, upload the public key content to your [SaltEdge Dashboard](https://www.saltedge.com/clients/api_keys).

---

## **1. RequestsApp**

**RequestsApp** demonstrates how to implement requests to Salt Edge.

### **Settings:**
- Settings are defined in the `SaltEdge.cs` file:
    - `APP_ID`: Your application ID.
    - `SECRET`: Your application secret.
- To generate the required private.pem and public.pem keys for Salt Edge integration, please refer to the official SaltEdge's Signature Guide.

  After generating the keys, ensure they are placed in the keys directory located at the root of your project.

### **Testing Requests:**
- For sample requests, refer to the `Program.cs` file.
- Examples are commented out for clarity. Uncomment desired sections and run the console application to test.

---

## **2. CallbackServer**

**CallbackServer** shows how to manage and validate callbacks from Salt Edge.

### **Settings:**
- To generate the required private.pem and public.pem keys for Salt Edge integration, please refer to the official SaltEdge's Signature Guide.

  After generating the keys, ensure they are placed in the keys directory located at the root of your project.

### **Testing Callbacks:**
- In the client dashboard, set up callback URLs. The URL format should be: `<host>/api/callback/:type`.
- To run the server, use the command: `dotnet run .`.

---

### **Getting Started:**
1. Clone this repository.
2. Set up your `.pem` files and configure the settings.
3. Run the desired application (`RequestsApp` or `CallbackServer`).
4. Make sure you've set up your SaltEdge dashboard correctly, especially if testing callbacks.

---

**Need Help?** Refer to the official [SaltEdge Documentation](https://docs.saltedge.com/) for additional details.
