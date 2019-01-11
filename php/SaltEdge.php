<?php

/**
 * Class SaltEdge
 * NOTE: The class allows re-usage, but as soon as it is not need the
 * shutdown method should be called in order erase the private key from the memory
 */
class SaltEdge
{
    /**
     * @var resource
     */
    private $privateKey;

    /**
     * @var string
     */
    private $clientId;

    /**
     * @var string
     */
    private $serviceSecret;

    /**
     * @var resource
     */
    protected $curlHandle;

    /**
     * @var boolean
     */
    protected $debug = false;

    /**
     * @param string      $clientId
     * @param string      $serviceSecret
     * @param string      $privateKeyPath
     * @param null|string $privateKeyPass
     *
     * @throws InvalidArgumentException when the path to the private key or the password was incorrect
     */
    public function __construct($appId, $secret, $privateKeyPath, $privateKeyPass = null)
    {
        $this->appId = $appId;
        $this->secret = $secret;

        // Load the private key
        $this->privateKey = openssl_get_privatekey($privateKeyPath, $privateKeyPass);

        if ($this->privateKey === false) {
            // There was an error loading the private key
            // Either the path to the key is incorrect or the key password
            throw new InvalidArgumentException("Could not load the private key.");
        }

        // Initialize cURL
        $this->curlHandle = curl_init();

        if ($this->curlHandle === false) {
            // There was an error loading the private key
            // Either the path to the key is incorrect or the key password
            throw new RuntimeException("Could not initialize cURL library.");
        }
    }

    /**
     * @param string      $clientId
     * @param string      $serviceSecret
     * @param string      $privateKeyPath
     * @param null|string $privateKeyPass
     *
     * @return static
     */
    public static function create($appId, $secret, $privateKeyPath, $privateKeyPass = null)
    {
        return new static($appId, $secret, $privateKeyPath, $privateKeyPass);
    }

    /**
     * @return resource
     */
    public function getCURLHandle()
    {
        return $this->curlHandle;
    }

    /**
     * Enables the debugging of cURL requests by increasing verbosity of the library
     *
     * @param bool $value
     */
    public function setDebug($value = true)
    {
        $this->debug = $value;
    }


    /**
     * Erases the private key from the memory and closes the cURL handle.
     * Should be called as soon as this object is not needed.
     */
    public function shutdown()
    {
        // Cleanup the key from memory
        openssl_free_key($this->privateKey);
        // Free up the cURL handler
        curl_close($this->curlHandle);

        $this->privateKey = null;
        $this->curlHandle = null;
    }

    /**
     * @param string   $method  GET or POST
     * @param string   $url     Url to which the request should be made
     * @param mixed    $payload Payload to be sent in the request body
     * @param int|null $expires Expiration timestamp
     *
     * @throws LogicException   If the object has been shut down
     * @throws Exception        If it fails to compute the signature of the request
     * @throws RuntimeException If cURL fails to fulfill the request
     * @return mixed
     */
    public function request($method, $url, $payload = "", $expires = null)
    {
        // Check if by chance the object has been shut down
        if ($this->privateKey === null || $this->curlHandle === null) {
            throw new LogicException("Failed to request using object that has been shut down.");
        }

        // Default expiration time to 3 minutes from now
        $expires = $expires ?: time() + 180;

        // JSON encode the payload if it is not a string
        $payload = is_string($payload) ? $payload : json_encode($payload);

        // Prepare the signature
        $data = $expires . "|" . $method . "|" . $url . "|" . $payload;

        // Sign the data
        $signingResult = openssl_sign(
          $data,
          $signature,
          $this->privateKey,
          OPENSSL_ALGO_SHA256
        );

        if (!$signingResult) {
            // Preparing the signature failed.
            throw new Exception('Failed to prepare the signature of the request.');
        }

        // The signature should be a base64 encoded string
        $signature = base64_encode($signature);

        // Prepare curl options
        $curlOptions = array(
            CURLOPT_URL => $url,
            CURLOPT_HTTPHEADER => array(
                "Content-Type: application/json",
                "Expires-at: {$expires}",
                "Signature: {$signature}",
                "App-id: {$this->appId}",
                "Secret: {$this->secret}",
            ),
            CURLOPT_RETURNTRANSFER => true,
            // Enable for debugging purposes
            CURLOPT_VERBOSE => $this->debug,
        );

        // Set additional options needed for post requests
        if ($method === 'POST') {
            $curlOptions[CURLOPT_POST] = true;
            $curlOptions[CURLOPT_POSTFIELDS] = $payload;
        } elseif ($method == 'PUT' || $method == 'DELETE') {
            $curlOptions[CURLOPT_CUSTOMREQUEST] = $method;
            $curlOptions[CURLOPT_POSTFIELDS] = $payload;
        } else {
            $curlOptions[CURLOPT_HTTPGET] = true;
        }

        // Set the options in the curl handler
        curl_setopt_array($this->curlHandle, $curlOptions);

        // Execute the http request
        $response = curl_exec($this->curlHandle);

        // Throw an exception when the cURL library fails to fulfill the request
        if ($response === false) {
            throw new RuntimeException(curl_error($this->curlHandle));
        }

        return $response;
    }

    /**
     * Shortcut method that makes a GET request
     *
     * @param string   $url
     * @param null|int $expire
     *
     * @throws LogicException   If the object has been shut down
     * @throws Exception        If it fails to compute the signature of the request
     * @throws RuntimeException If cURL fails to fulfill the request
     * @return mixed
     */
    public function get($url, $expire = null)
    {
        return $this->request('GET', $url, "", $expire);
    }

    /**
     * Shortcut method that makes a POST request
     *
     * @param string   $url
     * @param mixed    $payload
     * @param null|int $expire
     *
     * @throws LogicException   If the object has been shut down
     * @throws Exception        If it fails to compute the signature of the request
     * @throws RuntimeException If cURL fails to fulfill the request
     * @return mixed
     */
    public function post($url, $payload, $expire = null)
    {
        return $this->request('POST', $url, $payload, $expire);
    }

    /**
     * Shortcut method that makes a PUT request
     *
     * @param string   $url
     * @param mixed    $payload
     * @param null|int $expire
     *
     * @throws LogicException   If the object has been shut down
     * @throws Exception        If it fails to compute the signature of the request
     * @throws RuntimeException If cURL fails to fulfill the request
     * @return mixed
     */
    public function put($url, $payload, $expire = null)
    {
        return $this->request('PUT', $url, $payload, $expire);
    }

    /**
     * Shortcut method that makes a PUT request
     *
     * @param string     $url
     * @param null|mixed $payload
     * @param null|int   $expire
     *
     * @throws LogicException   If the object has been shut down
     * @throws Exception        If it fails to compute the signature of the request
     * @throws RuntimeException If cURL fails to fulfill the request
     * @return mixed
     */
    public function delete($url, $payload = null, $expire = null)
    {
        return $this->request('DELETE', $url, $payload, $expire);
    }
}
