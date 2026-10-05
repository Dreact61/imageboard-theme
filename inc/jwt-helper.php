<?php
if(!defined('ABSPATH')) exit;
 
require_once plugin_dir_path(__DIR__) . 'vendor/autoload.php';

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

    public static function get_uid_from_expired($token) {
        try {
            $decoded = JWT::decode($token, new Key(self::get_secret(), 'HS256'));
            return (int) ($decoded->uid ?? 0);
        } catch (\Firebase\JWT\ExpiredException $err) {
            $payload = (array) $err->getPayload();
            return (int) ($payload['uid'] ?? 0);
        } catch(\Exception $err) {
            return false;
        }
    }
}

//=========

add_filter('determine_current_user', function($user_id) {
    if ($user_id) {
        return $user_id;
    }

    $token = $_COOKIE['dchan_auth_token'] ?? '';
    if (empty($token)) {
        return $user_id;
    }

    $decoded_data = DCHAN_JWT::validate($token);

    if ($decoded_data) {
        $uid = (int) ($decoded_data['uid'] ?? 0);
        
        if ($uid > 0 && get_userdata($uid)) {
            if (isset($decoded_data['iat']) && (time() - $decoded_data['iat'] > HOUR_IN_SECONDS)) {
                setcookie('dchan_auth_token', $token, time() + (DAY_IN_SECONDS * 7), '/', '', false, true);
            }
            return $uid; 
        }
    } else {
        $uid = DCHAN_JWT::get_uid_from_expired($token);

        if ($uid > 0 && get_userdata($uid)) {
            $new_token = DCHAN_JWT::generate($uid);
            setcookie('dchan_auth_token', $new_token, time() + (DAY_IN_SECONDS * 7), '/', '', false, true);
            wp_set_auth_cookie($uid, true);
            return $uid;
        } else {
            setcookie('dchan_auth_token', '', time() - HOUR_IN_SECONDS, '/', '', false, true);
        }
    }

    return $user_id;
}, 10);

?>