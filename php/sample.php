<?php

require "SaltEdge.php";

// Client access credentials
define('CLIENT_ID', "YOUR_CLIENT_ID");
define("SERVICE_SECRET", "YOUR_SERVICE_SECRET");

// Private key details
$privateKeyPath = 'file://./private.pem';   // Path to private key file (relative or absolute)
$privateKeyPass = null;                     // Optional, if the private key is password protected

// Initialize
try {
    $seClient = new SaltEdge(CLIENT_ID, SERVICE_SECRET, $privateKeyPath, $privateKeyPass);

    // This is how a GET request is made
    echo $seClient->get("https://www.saltedge.com/api/v2/countries");

    // This is how a POST request is made
    /*
    $payload = array(
        "data" =>  array(
            "identifier" => "some_id",
        ),
    );

    echo $seClient->post("https://www.saltedge.com/api/v2/customers", $payload);
    */

    $seClient->shutdown();

} catch (Exception $exc) {
    // Handle possible errors
    echo $exc->getMessage();
}
