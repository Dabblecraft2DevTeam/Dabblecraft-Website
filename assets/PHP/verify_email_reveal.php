<?php
/**
 * Email reveal endpoint for the privacy policy page.
 *
 * The support email address is stored ONLY on the server (this file's
 * environment). The browser page never contains it. A valid hCaptcha
 * token must be verified server-side before the address is returned.
 *
 * Response: "OK|<email>" on success, "FAIL" on any failure.
 *
 * Configure: set HCAPTCHA_SECRET in the server environment (same secret
 * as the contact form handler).
 */

header('Content-Type: text/plain; charset=utf-8');

// EDIT: the contact address. Kept in one place, server-side only.
function getContactEmail() {
    // Prefer an environment override; fallback to the default address.
    $env = getenv('DC_SUPPORT_EMAIL');
    return $env ? $env : 'support@dabblecraft.tech';
}

$hcaptcha_secret = getenv('HCAPTCHA_SECRET');

if (empty($hcaptcha_secret)) {
    echo 'FAIL';
    http_response_code(500);
    exit;
}

$hcaptcha_token = isset($_POST['h-captcha-response']) ? $_POST['h-captcha-response'] : '';
if (empty($hcaptcha_token)) {
    echo 'FAIL';
    http_response_code(400);
    exit;
}

$hc_data = array(
    'secret' => $hcaptcha_secret,
    'response' => $hcaptcha_token
);

$hc_options = array(
    'http' => array(
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($hc_data),
        'timeout' => 10
    )
);
$hc_context = stream_context_create($hc_options);
$hc_result = @file_get_contents('https://api.hcaptcha.com/siteverify', false, $hc_context);
$hc_response = $hc_result ? json_decode($hc_result) : null;

if (!$hc_response || !isset($hc_response->success) || $hc_response->success !== true) {
    echo 'FAIL';
    http_response_code(403);
    exit;
}

// Optional: limit how often even verified visitors can request the email
// (mild abuse brake, e.g. one reveal per IP per 10 minutes).
$cache_file = sys_get_temp_dir() . '/dc_email_reveal_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$cooldown = 600; // seconds
if (file_exists($cache_file) && (time() - filemtime($cache_file)) < $cooldown) {
    // Reveal already granted recently - just return it (they passed captcha again)
    echo 'OK|' . getContactEmail();
    exit;
}
@touch($cache_file);

echo 'OK|' . getContactEmail();