<?php
function mw_is_authenticated(WP_REST_Request $req) {
    $token = $_COOKIE['dchan_auth_token'] ?? '';

    if (empty($token)) {
        return new WP_Error('rest_forbidden', 'Вы не авторизованы', ['status' => 401]);
    }

    $token_data = DCHAN_JWT::validate($token);
    if (!$token_data || empty($token_data['uid'])) {
        return new WP_Error('invalid_token', 'Токен сломан или просрочен', ['status' => 401]);
    }

    $user_id = $token_data['uid'];
    $fresh_token = DCHAN_JWT::generate($user_id);
    setcookie('dchan_auth_token', $fresh_token, time() + (DAY_IN_SECONDS * 7), '/', '', false, true);

    wp_set_current_user((int)$token_data['uid']);
    return true;
}
?>