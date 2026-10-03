<?php
add_filter('determine_current_user', 'dchan_global_jwt_auth', 20);

function dchan_global_jwt_auth($user_id)
{
    if ($user_id) {
        return $user_id;
    }

    $token = $_COOKIE['dchan_auth_token'] ?? '';
    if (empty($token)) {
        return $user_id;
    }

    $token_data = DCHAN_JWT::validate($token);
    if (empty($token_data['uid'])) {
        return $user_id;
    }

    return (int) $token_data['uid'];
}



function mw_is_authenticated(WP_REST_Request $request)
{
    if (get_current_user_id() <= 0) {
        return new WP_Error(
            'rest_not_logged_in',
            'Вы не авторизованы.',
            ['status' => 401]
        );
    }

    return true;
}

// Имеет ли юзер права админа?

function mw_has_admin_permission(WP_REST_Request $request)
{
    if (!current_user_can('manage_options')) {
        return new WP_Error(
            'rest_forbidden',
            'Недостаточно прав.',
            ['status' => 403]
        );
    }

    return true;
}

// Может ли юзер редачить доску?

function mw_is_board_owner(WP_REST_Request $req)
{
    $user_id = get_current_user_id();
    if (!$user_id) {
        return new WP_Error(
            'rest_forbidden',
            'Вы не авторизованы',
            ["status" => 401, "success" => false]
        );
    }

    if (current_user_can('manage_options')) {
        return true;
    }

    $board_id = absint($req->get_param('id'));

    if (!$board_id) {
        return new WP_Error(
            'missing_fields',
            'Не передан ID доски.',
            ['status' => 400, "success" => false]
        );
    }

    $board = get_post($board_id);

    if (!$board) {
        return new WP_Error(
            'board_not_found',
            'Доска не была найдена',
            ["status" => 404, "success" => false]
        );
    }
    $board_author = get_post_meta($board->ID, 'board_author', true);

    if ($board_author === get_current_user_id()) {
        return true;
    }

    return new WP_Error(
        'rest_forbidden',
        'Вы не являетесь создателем данной доски.',
        ['status' => 403]
    );
}

// Может ли юзер редачить тред?

function mw_is_thread_owner(WP_REST_Request $req)
{
    if (current_user_can('manage_options')) {
        return true;
    }

    $thread_id = absint($req->get_param('id'));

    if (!$thread_id) {
        return new WP_Error(
            'missing_fields',
            'Не передан ID треда.',
            ["status" => 400, "success" => false]
        );
    }

    $author_name = get_post_meta($thread_id, 'thread_author', true);

    if ($author_name === get_current_user_id()) {
        return true;
    }

    return new WP_Error(
        'rest_forbidden',
        'Вы не явялетесь автором данного треда.',
        ["status" => 403, "success" => false]
    );
};

// Может ли юзер редачить пост?

function mw_is_post_author(WP_REST_Request $request)
{
    if (current_user_can('manage_options')) {
        return true;
    }

    $post_id = absint($request->get_param('id'));

    if (!$post_id) {
        return new WP_Error(
            'missing_fields',
            'Не передан ID поста.',
            ['status' => 400, "success" => false]
        );
    }

    $author_id = absint(get_post_field('post_author', $post_id));

    if ($author_id === get_current_user_id()) {
        return true;
    }

    return new WP_Error(
        'rest_forbidden',
        'Вы не являетесь автором данного поста.',
        ['status' => 403]
    );
}

// Может ли юзер редачить юзера?

function mw_can_edit_user(WP_REST_Request $req)
{
    $is_admin = mw_has_admin_permission($req);
    if (is_wp_error($is_admin)) {
        $user_data = get_userdata(get_current_user_id());
        $target_id = $user_data->ID ?? '';

        $current_id = absint($req->get_param('id')) ?? 0;
        if ($current_id !== $target_id) {
            return new WP_Error('rest_forbidden', 'Вы не обладаете нужными правами для этого.', ["status" => 403, "success" => false]);
        }
    }

    return true;
}
