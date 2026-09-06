<?php
    function handle_user_register(WP_REST_Request $request) {
    $params = $request->get_json_params();

    if (empty($params)) {
        return new WP_Error('missing_fields', 'Не все важные поля были заполнены', array("status" => 400));
    }

    $username    = sanitize_user( $params['username'] );
    $password    = $params['password'];
    $name        = !empty( $params['name'] ) ? sanitize_text_field( $params['name'] ) : $username;
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
        'display_name' => $name,
        'nickname' => $name,
        'description' => $description,
        'role' => $role,
    ));

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    $response_data = array(
        'id' => $user_id,
        'username' => $username,
        'name' => $name,
        'description' => $description,
        'role' => $role,
    );

    return new WP_REST_Response([
        'success' => true,
        'user' => $response_data,
    ], 201);
}
?>