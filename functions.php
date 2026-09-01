<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('wp-enqueue_scripts', function() {
    wp_enqueue_script(
        'imageboard-proj',
        get_template_directory_uri() . '/build/index.js',
        array(),
        '1.0.0',
        true
    );

    wp_localize_script('imageboard-proj', 'wpApiSettings', array(
        'nonce' => wp_create_nonce('wp_rest')
    ));

    $css_path = 'build/output.css';
    if(file_exists(get_theme_file_path($css_path))) {
        wp_enqueue_style(
            'theme-tailwind',
            get_theme_file_uri($css_path),
            array(),
            '1.0.0',
            filemtime(get_theme_file_path($css_path))
        );
    }
});
//-------------REGISTER----------------------------------
add_action('rest_api_init', function() {
    register_rest_route('myapi/v1', '/users', array(
        'methods' => 'POST',
        'callback' => 'handle_user_register',
        'permission_callback' => '__return_true',
        'args' => array(
            'username' => array(
                'type' => 'string',
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'name' => array(
                'type' => 'string',
                'required' => false,
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'description' => array(
                'type' => 'string',
                'required' => false,
                'sanitize_callback' => 'sanitize_text_field',
            ),
            'password' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            )
        )
    ));
});

function handle_user_register($request) {
    $params = $request->get_json_params();

    if (empty($params)) {
        return new WP_Error('missing_fields', 'Некорректный формат данных', array("status" => 400));
    }

    $username    = sanitize_user( $params['username'] );
    $password    = $params['password'];
    $name        = !empty( $params['name'] ) ? sanitize_text_field( $params['name'] ) : $username;
    $description = !empty( $params['description'] ) ? sanitize_textarea_field( $params['description'] ) : '';
    $role = 'user';

    if (username_exists($username)) {
        return new WP_Error('username_taken', 'Вы не указали имя или пароль.', array("status" => 400));
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

    return WP_REST_Response($response_data, 201);
}
?>