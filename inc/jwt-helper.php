<?php
if(!defined('ABSPATH')) exit;

require_once get_temp_dir() . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class DCHAN_JWT {
    public static function get_secret() {
        return defined('SECURE_AUTH_KEY') ? SECURE_AUTH_KEY : 'fallback_secret_key';
    }

    public static function generate($user_id) {
        $key = self::get_secret();

        $payload = [
            'iss' => get_bloginfo('url'),
            'iat' => time(),
            'exp' => time() + (DAY_IN_SECONDS * 7),
            'uid' => (int)$user_id
        ];

        return JWT::encode($payload, $key, 'HS256');
    }

    public static function validate($token) {
        try {
            $decoded = JWT::decode($token, new Key(self::get_secret(), 'HS256'));
            return (array) $decoded;
        } catch (\Exception $err) {
            return false;
        }    
    }
}
?>