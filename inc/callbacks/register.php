<?php
    function handle_user_register(WP_REST_Request $request) {
    $params = $request->get_json_params();

    if (empty($params)) {
        return new WP_Error('missing_fields', 'Не все важные поля были заполнены', array("status" => 400));
    }

    $username = sanitize_user( $params['username'] );
    $password = $params['password'];
    $description = !empty($params['description']) ? $params['description'] : '';
    $role = 'user';

    if (!$params || !$username || !$password) {
        return new WP_Error('missing_fields', 'Не все важные поля были заполнены', ["status" => 400]);
    }

    if (username_exists($username)) {
        return new WP_Error('username_taken', 'Такое имя уже занято', array("status" => 400));
    }

    $user_id = wp_insert_user(array(
        'user_login' => $username,
        'display_name' => $username,
        'user_pass' => $password,
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

function handle_user_login(WP_REST_Request $request) {
    $params = $request->get_json_params();
    
    $username = $params['username'];
    $password = $params['password'];

    $user = wp_authenticate($username, $password);
    if (is_wp_error($user)) {
        return new WP_Error('invalid_credentials', 'Неверный логин или пароль', ["status" => 400, "success" => false]);
    }

    $user_role = !empty($user->roles) ? $user->roles[0] : 'user';
        
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
    if(!$current_user) {
        return new WP_Error('user_not_found', 'Пользователь не найден', ["status" => 404, "success" => false]);
    }

    $current_username = $current_user->display_name;
    $current_desc = $current_user->description;
    $current_pass = $current_user->user_pass;

    $new_username = $params['username'];
    $new_desc = $params['description'];
    $new_pass = $params['password'];

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
            'description' => $new_desc ?? '',
            'password' => $new_pass ?? ''
        ]
    ], 200);
}

function handle_user_deletion(WP_REST_Request $request) {
    require_once ABSPATH . 'wp-admin/includes/user.php';
    $id = $request->get_param('id');
    
    $user_exists = get_userdata($id);
    if(!$user_exists) {
        return new WP_Error('user_not_found', 'Пользователь не найден', ["status" => 404, "success" => false]);
    }

    $delete = wp_delete_user($id, null);
    if(!$delete) {
        return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500, "success" => false]);
    }

    return new WP_REST_Response([
        "success" => true,
        "id" => $id,
    ], 200);
}
?>