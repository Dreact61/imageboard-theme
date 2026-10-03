<?php
    function handle_user_register(WP_REST_Request $request) {
    $params = $request->get_json_params();

    $username = sanitize_user( $params['username'] );
    $password = $params['password'];
    $description = $params['description'] ?? '';
    $role = 'user';

    $user_id = wp_insert_user(array(
        'user_login' => $username,
        'user_nicename' => $username,
        'user_pass' => $password, // хешируется!!!!
        'description' => $description,
        'role' => $role,
    ));

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    $response_data = array(
        'id' => $user_id,
        'username' => $username,
        'description' => $description,
        'role' => $role,
    );

    return new WP_REST_Response([
        'success' => true,
        'user' => $response_data,
    ], 201);
}

function fetch_current_user(WP_REST_Request $request) {
    $id = $request->get_param('id');

    $user = get_userdata($id);
    if (!$user) {
        return new WP_Error('user_not_found', 'Пользователь не найден', ["status" => 404, "success" => false]);
    }

    return new WP_REST_Response([
        'success' => true,
        'user' => [
            'id' => $user->ID,
            'username' => $user->user_nicename,
            'description' => $user->description,
            'role' => $user->roles[0]
        ]
    ], 200);
}

function handle_user_login(WP_REST_Request $request) {
    $params = $request->get_json_params();
    
    $username = $params['username'];
    $password = $params['password'];

    $user = wp_authenticate($username, $password);
    if (is_wp_error($user)) {
        return new WP_Error('invalid_credentials', 'Неверный логин или пароль', ["status" => 400, "success" => false]);
    }

    $user_role = !empty($user->roles) ? $user->roles[0] : 'user';

    $token = DCHAN_JWT::generate($user->ID);
    setcookie('dchan_auth_token', $token, time() + (DAY_IN_SECONDS * 7), '/', '', false, true);
        
    return new WP_REST_Response([
        'success' => true,
        'user' => [
            'id' => $user->ID,
            'username' => $user->user_nicename,
            'description' => $user->description,
            'role' => $user_role,
        ],
    ]);
}

function handle_user_edit(WP_REST_Request $request) {
    $params = $request->get_json_params();

    $user_id = get_current_user_id();
    $current_user = get_userdata($user_id);

    $userdata = [
        'ID' => $user_id
    ];

    $has_changes = false;

    if (isset($params['description']) && $params['description'] !== $current_user->description) {
        $userdata['description'] = sanitize_text_field($params['description']);
        $has_changes = true;
    }

    if (!empty($params['password'])) {
        $is_same_pass = wp_check_password($params['password'], $current_user->user_pass, $user_id);
        if (!$is_same_pass) {
            $userdata['user_pass'] = $params['password'];
            $has_changes = true;
        }
    }

    if (!$has_changes) {
        return new WP_REST_Response(204);
    }

    $apply = wp_update_user($userdata);
    if (is_wp_error($apply)) {
        return new WP_Error('server_error', 'Ошибка на стороне сервера', [
            "status" => 500,
            "success" => false,
            "details" => $apply->get_error_message(),
        ]);
    }

    $updated_user = get_userdata($user_id);
    return new WP_REST_Response([
        "success" => true,
        "user" => [
            'id' => $updated_user->ID,
            'username' => $updated_user->user_nicename,
            'description' => $updated_user->description
        ]
    ], 200);
}

function handle_user_deletion(WP_REST_Request $request) {
    require_once ABSPATH . 'wp-admin/includes/user.php'; //wp_delete_user()
    $id = $request->get_param('id');

    $delete = wp_delete_user($id, null);
    if(!$delete) {
        return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500, "success" => false]);
    }

    return new WP_REST_Response([
        "success" => true,
        "id" => $id,
    ], 200);
}

function handle_user_logout(WP_REST_Request $request) {
    setcookie('dchan_auth_token', '', time() - 3600, '/', '', false, true);
    wp_set_current_user(0);

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Вы успешно вышли из системы'
    ]);
}

?>