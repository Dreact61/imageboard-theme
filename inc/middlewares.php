<?php

// Этот хук заставляет WordPress один раз при старте запроса прочитать куку
add_filter('determine_current_user', 'dchan_global_jwt_auth', 20);

function dchan_global_jwt_auth($user_id) {
    // Если WP уже определил юзера (например, в админке по родной куке), не мешаем
    if ($user_id) {
        return $user_id;
    }

    // Достаем строку токена из куки
    $token = $_COOKIE['dchan_auth_token'] ?? '';
    if (empty($token)) {
        return $user_id; // возвращаем 0
    }

    // Валидируем РЕАЛЬНЫЙ токен, а не его название
    $token_data = DCHAN_JWT::validate($token);
    if (empty($token_data['uid'])) {
        return $user_id; // возвращаем 0, если токен битый или просрочен
    }

    return (int) $token_data['uid'];
}



function mw_is_authenticated(WP_REST_Request $req)
{
    $user_id = get_current_user_id();

    if (!$user_id) {
        return new WP_Error('rest_forbidden', 'Вы не авторизованы', ['status' => 401]);
    }

    return true;
}

// Имеет ли юзер права админа?

function mw_has_admin_permission(WP_REST_Request $req)
{
    $is_auth = mw_is_authenticated($req);
    if (is_wp_error($is_auth)) {
        return $is_auth;
    }

    if (!current_user_can('manage_options')) {
        return new WP_Error('not_admin', 'Вы не обладаете правами администратора', ["status" => 403, "success" => false]);
    }

    return true;
}

// Может ли юзер редачить доску?

function mw_is_board_owner(WP_REST_Request $req)
{
    $is_admin = mw_has_admin_permission($req);
    if (is_wp_error($is_admin)) {
        $board_author = get_post_meta(absint($req->get_param('id')), 'board_author', true);
        
        $user_data = get_userdata(get_current_user_id());
        $current_username = $user_data->user_login ?? '';

        if ($current_username !== $board_author) {
            return new WP_Error('rest_forbidden', 'Вы не являетесь создателем данной доски.', ["status" => 403, "success" => false]);
        }
    }

    return true;
}

// Может ли юзер редачить тред?

function mw_is_thread_owner(WP_REST_Request $req)
{
    $is_board_owner = mw_is_board_owner($req);
    if (is_wp_error($is_board_owner)) {
        $thread_author = get_post_meta(absint($req->get_param('id')), 'thread_author', true);
        
        $user_data = get_userdata(get_current_user_id());
        $current_username = $user_data->user_login ?? '';

        if ($current_username !== $thread_author) {
            return new WP_Error('rest_forbidden', 'Вы не являетесь создателем данного треда.', ["status" => 403, "success" => false]);
        }
    }

    return true;
};

// Может ли юзер редачить пост?

function mw_is_post_author(WP_REST_Request $req)
{
    $is_thread_owner = mw_is_thread_owner($req);
    if (is_wp_error($is_thread_owner)) {
        $post_author = get_post_meta(absint($req->get_param('id')), 'post_author', true);
        
        $user_data = get_userdata(get_current_user_id());
        $current_username = $user_data->user_login ?? '';

        if ($current_username !== $post_author) {
            return new WP_Error('rest_forbidden', 'Вы не являетесь создателем данного поста.', ["status" => 403, "success" => false]);
        }
    }

    return true;
}

// Может ли юзер редачить юзера?

function mw_can_edit_user(WP_REST_Request $req)
{
    $is_admin = mw_has_admin_permission($req);
    if (is_wp_error($is_admin)) {
        $user_data = get_userdata(get_current_user_id());
        $target_id = $user_data->user_login ?? '';

        $current_id = absint($req->get_param('id')) ?? 0; 
        if ($current_id !== $target_id) {
            return new WP_Error('rest_forbidden', 'Вы не обладаете нужными правами для этого.', ["status" => 403, "success" => false]);
        }
    }

    return true;
}