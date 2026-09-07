<?php
    function handle_user_register(WP_REST_Request $request) {
    $params = $request->get_json_params();

    if (empty($params)) {
        return new WP_Error('missing_fields', 'Не все важные поля были заполнены', array("status" => 400));
    }

    $username    = sanitize_user( $params['username'] );
    $password    = $params['password'];
    $description = !empty( $params['description'] ) ? sanitize_textarea_field( $params['description'] ) : '';
    $role = 'user';

    if (!$params || !$username) {
        return new WP_Error('missing_fields', 'Не все важные поля были заполнены', ["status" => 400]);
    }

    if (username_exists($username)) {
        return new WP_Error('username_taken', 'Такое имя уже занято', array("status" => 400));
    }

    $user_id = wp_insert_user(array(
        'user_login' => $username,
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

function handle_user_login(WP_REST_Request) {
    $params = $request->get_json_params();
    
    $username = $params['username'];
    $password = $params['password'];

    $this_user = get_user_by('user_login', $username);
    if (!$this_user) {
        return new WP_Error('user_not_found', 'Пользователь с таким именем не был найден', ["status" => 404, "success" => false]);
    }

    if($this_user->user_pass !== $password) {
        return new WP_Error('incorrect_password', 'Вы ввели неправильный пароль от этого аккаунта', ["status" => 401, "success" => false]);
    }

    return new WP_REST_Response([
        'success' => true,
        'user' => [
            'id' => $this_user->ID,
            'username' => $this_user->user_login,
            'description' => $this_user->description,
            'role' => $this_user->role,
        ],
    ]);
}
?>