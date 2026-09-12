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

function mw_is_admin(WP_REST_Request $req) {
    $is_auth = mw_is_authenticated($req);
    if (is_wp_error($is_auth)) {
        return $is_auth;
    }

    $has_admin_rights = current_user_can('manage_options');
    if(!$has_admin_rights) {
        return new WP_Error('not_admin', 'Недостаточно прав', ["status" => 403]);
    }

    return true;
}

function mw_is_board_owner(WP_REST_Request $req) {
    $is_auth = mw_is_authenticated($req);
    if (is_wp_error($is_auth)) {
        return $is_auth;
    }

    $board_author = get_post_meta(absint($req->get_param('id')), 'board_author', true);
    $username = get_userdata(get_current_user_id())->user_login;

    if (!$username) {
        return new WP_Error('rest_forbidden', 'Вы не авторизованы', ["status" => 401, "success" => false]);
    }

    return $username === $board_author;
}

function mw_is_thread_owner(WP_REST_Request $req) {
    $is_auth = mw_is_authenticated($req);
    if (is_wp_error($is_auth)) {
        return $is_auth;
    }

    $thread_author = get_post_meta(absint($req->get_param('id')), 'thread_author', true);
    $username = get_userdata(get_current_user_id())->user_login;

    if (!$username) {
        return new WP_Error('rest_forbidden', 'Вы не авторизованы', ["status" => 401, "success" => false]);
    }

    return $username === $thread_author;
}

function mw_is_post_author(WP_REST_Request $req) {
    $is_auth = mw_is_authenticated($req);
    if (is_wp_error($is_auth)) {
        return $is_auth;
    }

    $post_author = get_post_meta(absint($req->get_param('id')), 'post_author', true);
    $username = get_userdata(get_current_user_id())->user_login;

    if (!$username) {
        return new WP_Error('rest_forbidden', 'Вы не авторизованы', ["status" => 401, "success" => false]);
    }
    return $username === $post_author;
}
?>