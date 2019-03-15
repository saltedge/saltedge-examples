<?php

/**
* DISCLAIMER:
* THIS FILE SHOULD SERVE AS A REFERENCE IMPLEMENTATION OF "SaltEdge" CLASS USAGE.
* IT IS NOT PRODUCTION READY, NOR INTENDED TO BE USED FOR REAL WORLD REQUESTS.
*/

/**
 * NOTE: This sample requires the following extensions installed and enabled:
 * - php_curl
 * - php_openssl
 */

require "SaltEdge.php";

// Client access credentials
define("APP_ID", "APP_ID");
define("SECRET", "SECRET");

// Private key details
$scriptPath     = dirname(__FILE__);
$privateKeyPath = "file://{$scriptPath}/private.pem"; // Path to private key file
$privateKeyPass = null;                               // Optional, if the private key is password protected

// Initialize
try {
    $seClient = new SaltEdge(APP_ID, SECRET, $privateKeyPath, $privateKeyPass);

    // This is how a GET request is made
    echo $seClient->get("https://www.saltedge.com/api/v5/countries");

    // This is how a POST request is made
    /*
    $payload = array(
        "data" =>  array(
            "identifier" => "some_id",
        ),
    );

    echo $seClient->post("https://www.saltedge.com/api/v5/customers", $payload);
    */

    $seClient->shutdown();

} catch (Exception $exc) {
    // Handle possible errors
    echo $exc->getMessage();
}
