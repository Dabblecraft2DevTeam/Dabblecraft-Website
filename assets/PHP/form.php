<?php
if (isset($_POST['Email'])) {

    // EDIT THE FOLLOWING TWO LINES:
    $email_to = "support@dabblecraft.com";
    $email_subject = "New Contact Submission";

    // hCaptcha verification settings
    // Set HCAPTCHA_SECRET in the server environment (do not commit secrets).
    $hcaptcha_secret = getenv('HCAPTCHA_SECRET');
    $hcaptcha_sitekey = getenv('HCAPTCHA_SITEKEY');

    function problem($error)
    {
        echo "We're sorry, but there were error(s) found with the form you submitted. ";
        echo "These errors appear below.<br><br>";
        echo $error . "<br><br>";
        echo "Please go back and fix these errors.<br><br>";
        die();
    }

    // hCaptcha: verify the token with hCaptcha's API before trusting the submission
    if (empty($hcaptcha_secret)) {
        // Secret not configured server-side: reject the submission rather than
        // silently accepting bots.
        problem("Captcha is not configured on the server. Please contact us another way.");
    }

    $hcaptcha_token = isset($_POST['h-captcha-response']) ? $_POST['h-captcha-response'] : '';
    if (empty($hcaptcha_token)) {
        problem("Please complete the captcha.");
    }

    $hc_data = array(
        'secret' => $hcaptcha_secret,
        'response' => $hcaptcha_token
    );
    if (!empty($hcaptcha_sitekey)) {
        $hc_data['sitekey'] = $hcaptcha_sitekey; // optional, prevents token reuse across sites
    }

    $hc_options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($hc_data)
        )
    );
    $hc_context = stream_context_create($hc_options);
    $hc_result = @file_get_contents('https://api.hcaptcha.com/siteverify', false, $hc_context);
    $hc_response = $hc_result ? json_decode($hc_result) : null;

    if (!$hc_response || !isset($hc_response->success) || $hc_response->success !== true) {
        problem("Captcha verification failed. Please go back and try again.");
    }

    // validation expected data exists
    if (
        !isset($_POST['Name']) ||
        !isset($_POST['Email']) ||
        !isset($_POST['Message']) ||
        !isset($_POST['privacy-class'])
    ) {
        problem("We're sorry, but there appears to be a problem with the form you submitted.");
    }

    $name = $_POST['Name']; // required
    $email = $_POST['Email']; // required
    $message = $_POST['Message']; // required

    // The privacy checkbox must be checked
    if ($_POST['privacy-class'] !== 'privacy-value') {
        problem("You must agree to the privacy policy before submitting.");
    }

    $error_message = "";

    $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';

    if (!preg_match($email_exp, $email)) {
        $error_message .= "The Email address you entered does not appear to be valid.<br>";
    }

    $string_exp = "/^[A-Za-z .'-]+$/";

    if (!preg_match($string_exp, $name)) {
        $error_message .= 'The Name you entered does not appear to be valid.<br>';
    }

    if (strlen($message) < 2) {
        $error_message .= 'The Message you entered do not appear to be valid.<br>';
    }

    if (strlen($message) > 3000) {
        $error_message .= 'The Message exceeds the maximum length of 3000 characters.<br>';
    }

    if (strlen($error_message) > 0) {
        problem($error_message);
    }

    $email_message = "Form details below.\n\n";

    function clean_string($string)
    {
        $bad = array("content-type", "bcc:", "to:", "cc:", "href");
        return str_replace($bad, "", $string);
    }

    $email_message .= "Name: " . clean_string($name) . "\n";
    $email_message .= "Email: " . clean_string($email) . "\n";
    $email_message .= "Message: " . clean_string($message) . "\n";

    // create email headers
    $headers = 'From: ' . $email . "\r\n" .
        'Reply-To: ' . $email . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    @mail($email_to, $email_subject, $email_message, $headers);
?>

    <!-- INCLUDE YOUR SUCCESS MESSAGE BELOW -->

    Thanks for getting in touch. We'll get back to you soon.

<?php
}
?>