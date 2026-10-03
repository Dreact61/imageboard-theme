<?php
    function imageboard_create_thread(WP_REST_Request $request) {
        $params = $request->get_json_params();

        $board_mark = $params['parent'];
        $author = $params['author'];
        $name = $params['name'];
        $description = $params['description'] ?? '';
        $status = strtoupper($params['status']);
        $password = $params['password'] ?? '';

        $board_posts = get_posts([
            'post_type' => 'board',
            'posts_per_page' => 1,
            'meta_key' => 'board_mark',
            'meta_value' => $board_mark,
            'post_status' => 'publish'
        ]);

        if (!$board_posts) {
            return new WP_Error('board_not_found', 'Доска не была найдена', ["status" => 404]);
        }

        $post = wp_insert_post([
            'post_type' => 'thread',
            'post_title' => $name,
            'post_content' => '',
            'post_status' => 'publish',
            'post_author' => get_current_user_id(),
            'meta_input' => [
                'board_mark' => $board_mark,
                'thread_description' => $description,
                'thread_status' => $status,
                'thread_author' => $author,
                'thread_password' => $password
            ],
        ]);

        if (is_wp_error($post)) {
            return new WP_Error('server_error', "Ошибка на стороне сервера", ["status" => 500]);
        }

        $result = [
            'id' => $post,
            'name' => $name,
            'description' => $description,
            'parent' => $board_mark,
            'author' => $author,
            'createdAt' => get_the_date('Y-m-d H:i:s', $post),
            'status' => $status
        ];

        return new WP_REST_Response([
            'success' => true,
            'thread_data' => $result,
        ], 201);
    }

    function fetch_current_thread_api(WP_REST_Request $request) {
        $id = $request->get_param('id');

        $thread = get_post($id);
        if (!$thread) {
            return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500]);
        }

        $result_thread = [
            'id' => $thread->ID,
            'name' => $thread->post_title,
            'description' => get_post_meta($thread->ID, 'thread_description', true),
            'parent' => get_post_meta($thread->ID, 'board_mark', true),
            'author' => get_post_meta($thread->ID, 'thread_author', true),
            'createdAt' => $thread->post_date,
            'status' => get_post_meta($thread->ID, 'thread_status', true),
        ];

        $relative_posts = get_posts([
            'posts_per_page' => -1,
            'post_type' => 'thread_post',
            'post_status' => 'publish',
            'meta_key' => 'thread_id',
            'meta_value' => $thread->ID
        ]);
        $result_posts = [];
        foreach($relative_posts as $post) {
            $result_posts[] = [
                'id' => $post->ID,
                'content' => $post->post_content,
                'author' => get_post_meta($post->ID, 'post_author', true),
                'createdAt' => get_the_date('Y-m-d H:i:s', $post->ID),
                'parent' => $thread->ID
            ];
        }

        return new WP_REST_Response([
            "success" => true,
            "thread" => $result_thread,
            "posts" => $result_posts
        ]);
    }   

    function edit_current_thread_api(WP_REST_Request $request) {
        $params = $request->get_json_params();
        $id = $params['id'];

        $thread = get_post($id);
        if (!isset($thread)) {
            return new WP_Error('thread_not_found', 'Тред не был найден', ["status" => 404]);
        }

        $current_name = $thread->post_title;
        $current_desc = get_post_meta($thread->ID, 'thread_description', true);
        $current_status = get_post_meta($thread->ID, 'thread_status', true);
        $current_pass = get_post_meta($thread->ID, 'thread_password', true);

        $new_name = trim($params['name']) ?? $current_name;
        $new_desc = trim($params['description']) ?? $current_desc;
        $new_pass = trim($params['password']) ?? $current_pass;
        $new_status = trim($params['status']) ?? $current_status;

        if ($current_pass === $new_pass && $current_desc === $new_desc && $current_name === $new_name && $current_status === $new_status) {
            return new WP_REST_Response([
                'success' => true,
                'thread' => $thread,
            ], 204);
        }

        $new_data = [
            'ID' => $id,
            'post_title' => $new_name,
            'post_status' => 'publish',
            'post_content' => '',
            'meta_input' => [
                'thread_description' => $new_desc,
                'thread_password' => $new_pass,
                'thread_status' => $new_status,
                'thread_author' => get_post_meta($id, 'thread_author', true),
                'board_mark' => get_post_meta($id, 'board_mark', true)
            ],
        ];
        $post_id = wp_update_post($new_data);

        if (is_wp_error($post_id)) {
            return new WP_Error(
                'server_error',
                'Ошибка на стороне сервера',
                [
                    "status" => 500,
                    "success" => false,
                    "details" => $post_id->get_error_message(),
                ]
            );
        }

        $result = [
            'id' => $thread->ID,
            'name' => $new_name,
            'description' => $new_desc,
            'parent' => get_post_meta($thread->ID, 'board_mark', true),
            'author' => get_post_meta($thread->ID, 'thread_author', true),
            'createdAt' => get_the_date('Y-m-d H:i:s', $thread->ID),
            'status' => $new_status,
            'password' => $new_pass
        ];

        return new WP_REST_Response([
            'success' => true,
            'thread' => $result,
        ]);
    }

    function delete_current_thread_api(WP_REST_Request $request) {
        $id = $request->get_param('id');

        $relative_posts = get_posts([
            'posts_per_page' => -1,
            'post_type' => 'thread_post',
            'post_status' => 'any',
            'meta_key' => 'thread_id',
            'meta_value' => $id
        ]);
        foreach($relative_posts as $post) {
            wp_delete_post($post->ID, true);
        }

        $post_deletion = wp_delete_post($id, true);
        if(!$post_deletion) {
            return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500, "success" => false]);
        }

        return new WP_REST_Response([
            'success' => true,
            'thread_id' => $id,
        ]);
    }

    function handle_private_thread_pass_api(WP_REST_Request $request) {
        $params = $request->get_json_params();

        $password = $params['password'];
        $id = $params['id'];

        $thread = get_post($id);
        if (!$thread && (!($thread instanceof WP_Post))) {
            return new WP_Error('thread_not_found', 'Тред не был найден', ["status" => 404]);
        }

        $thread_pass = get_post_meta($thread->ID, 'thread_password', true);

        if ($password !== $thread_pass) {
            return new WP_Error('invalid_password', 'Пароль неверный.', ["status" => 403, "password" => $thread_pass ?? 'seledka']);
        }

        return new WP_REST_Response([
            'success' => true
        ], 200);
    }

    function handle_thread_password_output_api(WP_REST_Request $request) {
        $id = $request->get_param('id');
        $thread_password = get_post_meta($id, 'thread_password', true);

        if (!$thread_password) {
            return new WP_Error('thread_not_found', 'Тред не был найден', ["status" => 404, "success" => false]);
        }

        return new WP_REST_Response([
            'success' => true,
            'password' => $thread_password
        ]);
    }
?>