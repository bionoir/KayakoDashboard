<?php
	//phpinfo();
	
		
	$apiKey = "6af177eb-e6f8-9a74-2929-6e02e6ea8918";
		 
	$secretKey = "OGY5MjNhODktNDMyYy0zZjU0LWE1OTYtMmQ1NjUzYjJlOWZkNjg1N2NjODgtOTM2Mi04MDk0LWI1NzQtN2U2OTZmMTUxMTg4";
	 
   	// Generates a random string of ten digits
   	$salt = mt_rand();
 
   	// Computes the signature by hashing the salt with the secret key as the key
   	$signature = hash_hmac('sha256', $salt, $secretKey, true);
 
   	// base64 encode...
   	$encodedSignature = base64_encode($signature);
 
   	// urlencode...
   	$encodedSignature = urlencode($encodedSignature);
 
   	echo "Voila! salt : " . $salt . " and signature : " . $encodedSignature;
?>