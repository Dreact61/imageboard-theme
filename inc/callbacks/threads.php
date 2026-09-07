<?php
    function imageboard_create_thread(WP_REST_Request $request) {
        $params = $request->get_json_params();

        if (empty($params['name']) || empty($params['parent'])) {
            return new WP_Error('missing_fields', "Не все важные поля были заполнены", ["status" => 400]);
        }

        $board_mark = $params['parent'];
        $author = empty($params['author']) ? 'Anonymous' : $params['author'];

        $board_posts = get_posts([
            'post_type' => 'board',
            'posts_per_page' => 1,
            'meta_key' => 'board_mark',
            'meta_value' => $board_mark,
            'post_status' => 'publish'
        ]);

        if (empty($board_posts)) {
            return new WP_Error('board_not_found', 'Доска не была найдена', ["status" => 400]);
        }

        $name = $params['name'];
        $description = empty($params['description']) ? '' : $params['description'];
        $status = empty($params['status']) ? 'PUBLIC' : strtoupper($params['status']);

        $post = wp_insert_post([
            'post_type' => 'thread',
            'post_title' => $name,
            'post_content' => '',
            'post_status' => 'publish',
            'post_author' => $author === 'Anonymous' ? 0 : get_current_user_id(),
            'meta_input' => [
                'board_mark' => $board_mark,
                'thread_description' => $description,
                'thread_status' => $status,
                'thread_author' => $author
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
            'status' => $status,
        ];

        return new WP_REST_Response([
            'success' => true,
            'thread_data' => $result,
        ], 201);
    }

    function fetch_current_thread_api(WP_REST_Request $request) {
        $mark = $request->get_param('mark');
        if (empty($mark)) {
            return new WP_Error('not_defined', 'Недостоверные данные', ["status" => 400, "success" => true]);
        }

        $post = get_posts([
            'posts_per_page' => 1,
            'post_type' => 'thread',
            'post_status' => 'publish',
            'meta_key' => 'board_mark',
            'meta_value' => $mark
        ]);
        if (is_wp_error($post)) {
            return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500]);
        }

        $thread = $post[0];
        $result_thread = [
            'id' => $thread->ID,
            'name' => $thread->post_title,
            'description' => get_post_meta($thread->ID, 'thread_description', true),
            'parent' => get_post_meta($thread->ID, 'board_mark', true),
            'author' => get_post_meta($thread->ID, 'thread_author', true),
            'createdAt' => get_the_date('Y-m-n H:i:s', $thread->ID),
            'status' => get_post_meta($thread->ID, 'thread_status', true)
        ];

        $relative_posts = get_posts([
            'posts_per_page' => -1,
            'post_type' => 'thread_post',
            'post_status' => 'any',
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
        if (empty($params) || empty($params['id'])) {
            return new WP_Error('not_defined', 'Недостоверные данные', ["status" => 400]);
        }
        
        $id = $params['id'];

        $post = get_posts([
            'include' => $id,
            'post_type' => 'thread',
            'post_status' => 'publish'
        ]);

        if (empty($post)) {
            return new WP_Error('thread_not_found', 'Тред не был найден', ["status" => 404]);
        }

        $thread = $post[0];

        $current_name = $thread->post_title;
        $current_desc = get_post_meta($thread->ID, 'thread_description', true);
        $current_status = get_post_meta($thread->ID, 'thread_status', true);

        $new_name = trim($params['name']);
        $new_desc = trim($params['description']);
        $new_status = strtoupper($params['status']);

        if ($current_desc === $new_desc && $current_name === $new_name && $current_status === $new_status) {
            return new WP_REST_Response([
                'success' => true,
                'thread' => null,
            ], 204);
        }

        $new_data = [
            'ID' => $id,
            'post_title' => $new_name,
            'meta_input' => [
                'thread_description' => $new_desc,
                'thread_status' => $new_status,
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
            'createdAt' => get_the_date('Y-m-n H:i:s', $thread->ID),
            'status' => $new_status,
        ];

        return new WP_REST_Response([
            'success' => true,
            'thread' => $result,
        ]);
    }

    function delete_current_thread_api(WP_REST_Request $request) {
        $id = $request->get_param('id');
        if(empty($id)) {
            return new WP_Error('not_defined', 'Недостоверные данные', ["status" => 400]);
        }

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
?>