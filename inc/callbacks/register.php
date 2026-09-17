<?php
    function handle_user_register(WP_REST_Request $request) {
    $params = $request->get_json_params();

    $username = sanitize_user( $params['username'] );
    $password = $params['password'];
    $description = $params['description'] ?? '';
    $role = 'user';

    $user_id = wp_insert_user(array(
        'user_login' => $username,
        'display_name' => $username,
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
        'user' => $user
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
            'username' => $user->user_login,
            'description' => $user->description,
            'role' => $user_role,
        ],
    ]);
}

function handle_user_edit(WP_REST_Request $request) {
    $params = $request->get_json_params();

    $current_user = get_userdata($params['id']);

    $current_username = $current_user->display_name;
    $current_desc = $current_user->description;
    $current_pass = $current_user->user_pass;

    $new_username = $params['username'] ?? $current_username;
    $new_desc = $params['description'] ?? $current_desc;
    $new_pass = $params['password'] ?? $current_pass;

    $userdata = [
        'ID' => $params['id']
    ];

    $has_changes = false;
    $is_pass_changed = (!empty($new_pass)) && !wp_check_password($new_pass, $current_pass, $params['id']);

    if(isset($new_desc) && $new_desc !== $current_desc) {
        $userdata['description'] = $new_desc;
        $has_changes = true;
    } 

    if (isset($new_username) && $new_username !== $current_username) {
        $userdata['display_name'] = $new_username;
        $has_changes = true;
    }

    if ($is_pass_changed) {
        $userdata['user_pass'] = $new_pass;
        $has_changes = true;
    }

    if (!$has_changes) {
        return new WP_REST_Response([
            "success" => true,
            "user" => null
        ], 204);
    }

    $apply = wp_update_user($userdata);
    if (is_wp_error($apply)) {
        return new WP_Error(
            'server_error', 
            'Ошибка на стороне сервера', 
            [
                "status" => 500,
                "success" => false,
                "details" => $apply->get_error_message(),
            ]);
    }

    return new WP_REST_Response([
        "success" => true,
        "user" => [
            'id' => $params['id'],
            'name' => $new_username ?? '',
            'description' => $new_desc ?? ''
        ]
    ], 200);
}

function handle_user_deletion(WP_REST_Request $request) {
    require_once ABSPATH . 'wp-admin/includes/user.php'; // импорт для wp_delete_user()
    $id = $request->get_param('id');

    $delete = wp_delete_user($id, null); // вот тут оно применяется
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