<?php

/**
 * Class SaltEdge
 * NOTE: The class allows re-usage, but as soon as it is not needed, the
 * shutdown method should be called in order to erase the private key from the memory.
 */
class SaltEdge
{
    /**
     * @var resource The private key resource used for signing requests.
     */
    private $privateKey;

    /**
     * @var string The App ID for authentication.
     */
    private $appId;

    /**
     * @var string The App Secret for authentication.
     */
    private $secret;

    /**
     * @var resource The cURL handle used for making requests.
     */
    private $curlHandle;

    /**
     * @var boolean Indicates whether debugging of cURL requests is enabled.
     */
    private $debug = false;

    /**
     * SaltEdge constructor.
     *
     * @param string      $appId           The App ID for authentication.
     * @param string      $secret          The App Secret for authentication.
     * @param string      $privateKeyPath  The file path to the private key.
     * @param null|string $privateKeyPass  The password for the private key, if it's encrypted.
     *
     * @throws InvalidArgumentException When the path to the private key or the password was incorrect.
     * @throws RuntimeException         When cURL library fails to initialize.
     */
    public function __construct($appId, $secret, $privateKeyPath, $privateKeyPass = null)
    {
        $this->appId  = $appId;
        $this->secret = $secret;

        $this->loadPrivateKey($privateKeyPath, $privateKeyPass);
        $this->initializeCurl();
    }

    /**
     * Factory method to create a new instance of the SaltEdge class.
     *
     * @param string      $appId           The App ID for authentication.
     * @param string      $secret          The App Secret for authentication.
     * @param string      $privateKeyPath  The file path to the private key.
     * @param null|string $privateKeyPass  The password for the private key, if it's encrypted.
     *
     * @return static A new instance of the SaltEdge class.
     */
    public static function create($appId, $secret, $privateKeyPath, $privateKeyPass = null)
    {
        return new static($appId, $secret, $privateKeyPath, $privateKeyPass);
    }

    /**
     * Enables or disables debugging of cURL requests by increasing verbosity of the library.
     *
     * @param bool $value Whether to enable debugging or not.
     */
    public function setDebug($value = true)
    {
        $this->debug = $value;
    }

    /**
     * Erases the private key from the memory and closes the cURL handle.
     * Should be called as soon as this object is no longer needed.
     */
    public function shutdown()
    {
        $this->cleanup();
        $this->privateKey = null;
        $this->curlHandle = null;
    }

    /**
     * Shortcut method that makes a GET request.
     *
     * @param string     $url    URL to which the GET request should be made.
     * @param null|int   $expire Expiration timestamp.
     *
     * @return mixed The response received from the server.
     * @throws LogicException   If the object has been shut down.
     * @throws Exception        If it fails to compute the signature of the request.
     * @throws RuntimeException If cURL fails to fulfill the request.
     */
    public function get($url, $expire = null)
    {
        return $this->sendRequest('GET', $url, '', $expire);
    }

    /**
     * Shortcut method that makes a POST request.
     *
     * @param string     $url     URL to which the POST request should be made.
     * @param mixed      $payload Payload to be sent in the request body.
     * @param null|int   $expire  Expiration timestamp.
     *
     * @return mixed The response received from the server.
     * @throws LogicException   If the object has been shut down.
     * @throws Exception        If it fails to compute the signature of the request.
     * @throws RuntimeException If cURL fails to fulfill the request.
     */
    public function post($url, $payload, $expire = null)
    {
        return $this->sendRequest('POST', $url, $payload, $expire);
    }

    /**
     * Shortcut method that makes a PUT request.
     *
     * @param string     $url     URL to which the PUT request should be made.
     * @param mixed      $payload Payload to be sent in the request body.
     * @param null|int   $expire  Expiration timestamp.
     *
     * @return mixed The response received from the server.
     * @throws LogicException   If the object has been shut down.
     * @throws Exception        If it fails to compute the signature of the request.
     * @throws RuntimeException If cURL fails to fulfill the request.
     */
    public function put($url, $payload, $expire = null)
    {
        return $this->sendRequest('PUT', $url, $payload, $expire);
    }

    /**
     * Shortcut method that makes a DELETE request.
     *
     * @param string     $url     URL to which the DELETE request should be made.
     * @param null|mixed $payload Payload to be sent in the request body.
     * @param null|int   $expire  Expiration timestamp.
     *
     * @return mixed The response received from the server.
     * @throws LogicException   If the object has been shut down.
     * @throws Exception        If it fails to compute the signature of the request.
     * @throws RuntimeException If cURL fails to fulfill the request.
     */
    public function delete($url, $payload = null, $expire = null)
    {
        return $this->sendRequest('DELETE', $url, $payload, $expire);
    }

    /**
     * Load the private key from the provided file path and password (if any).
     *
     * @param string     $privateKeyPath The file path to the private key.
     * @param null|string $privateKeyPass The password for the private key, if it's encrypted.
     *
     * @throws InvalidArgumentException When the path to the private key or the password was incorrect.
     */
    private function loadPrivateKey($privateKeyPath, $privateKeyPass)
    {
        $this->privateKey = openssl_get_privatekey($privateKeyPath, $privateKeyPass);

        if ($this->privateKey === false) {
            throw new InvalidArgumentException("Could not load the private key.");
        }
    }

    /**
     * Initialize the cURL handle for making requests.
     *
     * @throws RuntimeException When cURL library fails to initialize.
     */
    private function initializeCurl()
    {
        $this->curlHandle = curl_init();

        if ($this->curlHandle === false) {
            throw new RuntimeException("Could not initialize cURL library.");
        }
    }

    /**
     * Clean up resources by freeing the private key and closing

 the cURL handle.
     */
    private function cleanup()
    {
        openssl_free_key($this->privateKey);
        curl_close($this->curlHandle);
    }

    /**
     * Send an HTTP request with a computed signature based on the private key.
     *
     * @param string     $method  The HTTP method (GET, POST, PUT, DELETE).
     * @param string     $url     URL to which the request should be made.
     * @param mixed      $payload Payload to be sent in the request body.
     * @param null|int   $expires Expiration timestamp.
     *
     * @return mixed The response received from the server.
     * @throws LogicException   If the object has been shut down.
     * @throws Exception        If it fails to compute the signature of the request.
     * @throws RuntimeException If cURL fails to fulfill the request.
     */
    private function sendRequest($method, $url, $payload = "", $expires = null)
    {
        // Check if the object has been shut down
        if ($this->privateKey === null || $this->curlHandle === null) {
            throw new LogicException("Failed to request using an object that has been shut down.");
        }

        $expires = $expires ?: time() + 180;
        $payload = is_string($payload) ? $payload : json_encode($payload);
        $data = $expires . "|" . $method . "|" . $url . "|" . $payload;

        $signature = $this->computeSignature($data);

        $curlOptions = [
            CURLOPT_URL        => $url,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Expires-at:   {$expires}",
                "Signature:    {$signature}",
                "App-id:       {$this->appId}",
                "Secret:       {$this->secret}",
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_VERBOSE        => $this->debug,
        ];

        $this->setRequestMethodOptions($method, $payload, $curlOptions);
        curl_setopt_array($this->curlHandle, $curlOptions);

        $response = curl_exec($this->curlHandle);

        if ($response === false) {
            throw new RuntimeException(curl_error($this->curlHandle));
        }

        return $response;
    }

    /**
     * Compute the request signature based on the provided data.
     *
     * @param string $data The data to be signed.
     *
     * @return string The base64-encoded signature.
     * @throws Exception If it fails to prepare the signature of the request.
     */
    private function computeSignature($data)
    {
        $signature = '';
        openssl_sign($data, $signature, $this->privateKey, OPENSSL_ALGO_SHA256);

        if (!$signature) {
            throw new Exception('Failed to prepare the signature of the request.');
        }

        return base64_encode($signature);
    }

    /**
     * Set cURL options based on the HTTP method and payload.
     *
     * @param string $method      The HTTP method (GET, POST, PUT, DELETE).
     * @param string $payload     Payload to be sent in the request body.
     * @param array  $curlOptions Reference to the cURL options array.
     */
    private function setRequestMethodOptions($method, $payload, array &$curlOptions)
    {
        if ($method === 'POST') {
            $curlOptions[CURLOPT_POST]       = true;
            $curlOptions[CURLOPT_POSTFIELDS] = $payload;
        } elseif ($method == 'PUT' || $method == 'DELETE') {
            $curlOptions[CURLOPT_CUSTOMREQUEST] = $method;
            $curlOptions[CURLOPT_POSTFIELDS]    = $payload;
        } else {
            $curlOptions[CURLOPT_HTTPGET] = true;
        }
    }
}
