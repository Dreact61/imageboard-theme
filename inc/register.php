<?php
    function register_boards_api(WP_REST_REQUEST $request) {
        $params = $request->get_json_params();

        if (empty($params['title']) || empty($params['mark'])):
            return new WP_Error('missing_fields', 'Не все важные поля не были заполнены', array("status" => 400));
        endif;
        
        $name = sanitize_text_field($params['username']);
        $description = empty($params['description']) ? '' : sanitize_text_field($params['description']);
        $mark = sanitize_text_field($params['mark']);
        $author_id = get_current_user_id();
        $createdAt = empty($params['createdAt']) ? 'N/A' : sanitize_text_field($params['createdAt']);

        if(empty($author_id)):
            return new WP_Error('author_not_defined', 'Пользователь не найден или не зарегистрирован', array("status" => 401));
        endif;

        $post_id = wp_insert_post([
            'post_type' => 'board',
            'post_title' => $name,
            'post_content' => '',
            'post_status' => 'publish',
            'post_author' => $author_id,
            'meta_input' => [
                'board_description' => $description,
                'board_mark' => $mark,
                'board_createdAt' => $createdAt,
            ],
        ]);

        if (is_wp_error($post_id)):
            return new WP_Error('server_error', 'Ошибка на строне сервера', ["status" => 500]);
        endif;

        $result = [
            'id' => $post_id,
            'name' => $name,
            'description' => $description,
            'mark' => $mark,
            'author' => $author_id,
            'createdAt' => $createdAt
        ];

        return new WP_REST_Response([
            'success' => true,
            'board_data' => $result,
        ]);
    }

    //------

    function imageboard_create_thread(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $board_id = absint($params['parent']);

        if (empty($params['name']) || empty($params['parent'])) {
            return new WP_Error('missing_fields', "Не все важные поля не были заполнены", ["status" => 400]);
        }

        $board = get_post($board_id);
        if (!$board || $board->post_type !== 'board') {
            return new WP_Error('board_not_found', 'Борд не был найден', ["status" => 400]);
        }

        $name = sanitize_text_field($params['name']);
        $description = sanitize_text_field($params) ?? '';
        $author_id = get_current_user_id() ?? 0;
        $createdAt = sanitize_text_field($params['createdAt']) ?? 'N/A';
        $status = sanitize_text_field($params['status']) ?? 'PUBLIC';

        $post_id = wp_insert_post([
            'post_type' => 'thread',
            'post_title' => $name,
            'post_content' => '',
            'post_status' => 'publish',
            'post_author' => $author_id,
            'meta_input' => [
                'board_id' => $board_id,
                'thread_description' => $description,
                'thread_createdAt' => $createdAt,
                'thread_status' => $status,
            ],
        ]);

        if (is_wp_error($post_id)) {
            return new WP_Error('server_error', "Ошибка на стороне сервера", ["status" => 500]);
        }

        $result = [
            'id' => $post_id,
            'name' => $name,
            'description' => $description,
            'board_id' => $board_id,
            'author' => $author_id,
            'createdAt' => $createdAt,
            'status' => $status,
        ];

        return new WP_REST_Response([
            'success' => true,
            'thread_data' => $result,
        ]);
    }

    //-------

    function handle_user_register($request) {
    $params = $request->get_json_params();

    if (empty($params)) {
        return new WP_Error('missing_fields', 'Не все важные поля не были заполнены', array("status" => 400));
    }

    $username    = sanitize_user( $params['username'] );
    $password    = $params['password'];
    $name        = !empty( $params['name'] ) ? sanitize_text_field( $params['name'] ) : $username;
    $description = !empty( $params['description'] ) ? sanitize_textarea_field( $params['description'] ) : '';
    $role = 'user';

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

    return new WP_REST_Response($response_data, 201);
}
?>