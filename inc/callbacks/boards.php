<?php
    function register_boards_api(WP_REST_Request $request) {
        $params = $request->get_json_params();

        if (empty($params['name']) || empty($params['mark'])) {
            return new WP_Error('missing_fields', 'Не все важные поля были заполнены', ["status" => 400, "success" => false]);
        }
        
        $name = $params['name'];
        $description = empty($params['description']) ? '' : $params['description'];
        $mark = $params['mark'];
        $author = $params['author'];
        $author_id = get_current_user_id();

        if(empty($author_id)) {
            return new WP_Error('author_not_defined', 'Пользователь не найден или не зарегистрирован', ["status" => 401, "success" => false]);
        }

        $post_id = wp_insert_post([
            'post_type' => 'board',
            'post_title' => $name,
            'post_content' => '',
            'post_status' => 'publish',
            'post_author' => $author_id,
            'meta_input' => [
                'board_description' => $description,
                'board_mark' => $mark,
                'board_author' => $author,
            ],
        ]);

        if (is_wp_error($post_id)) {
            return new WP_Error('server_error', 'Ошибка на строне сервера', ["status" => 500, "success" => false]);
        }

        $result = [
            'id' => $post_id,
            'name' => $name,
            'description' => $description,
            'mark' => $mark,
            'author' => $author,
            'createdAt' => get_the_date('Y-m-d H:i:s', $post_id),
        ];

        return new WP_REST_Response([
            'success' => true,
            'board_data' => $result,
            'threads' => [],
        ], 201);
    }


    function fetch_current_board_api(WP_REST_Request $request) {
        $mark = $request->get_param('mark');

        if(!$mark) {
            return new WP_Error('not_defined', 'Недостоверные данные', ["status" => 400, "success" => false]);
        }

        $post = get_posts([
            'post_type' => 'board',
            'posts_per_page' => 1,
            'meta_key' => 'board_mark',
            'meta_value' => $mark,
            'post_status' => 'publish'
        ]);

        $relative_threads = get_posts([
            'post_type' => 'thread',
            'posts_per_page' => -1,
            'meta_key' => 'board_mark',
            'meta_value' => $mark,
            'post_status' => 'any',
        ]);

        if (empty($post)) {
            return new WP_Error('board_not_found', "Доска с пометкой " . esc_html($mark) . " не найдена", ["status" => 400, "success" => false]);
        }

        $board = $post[0];
        
        $result_board = [
            'id' => $board->ID,
            'name' => $board->post_title,
            'description' => get_post_meta($board->ID, 'board_description', true),
            'mark' => $mark,
            'author' => $board->post_author,
            'createdAt' => $board->post_date,
        ];

        $result_threads = [];
        foreach($relative_threads as $value) {
            $result_threads[] = [
                'id' => $value->ID,
                'name' => $value->post_title,
                'description' => get_post_meta($value->ID, 'thread_description', true),
                'parent' => get_post_meta($value->ID, 'board_mark', true),
                'author' => $value->post_author,
                'createdAt' => get_the_date('Y-m-d H:i:s', $value->ID),
                'status' => get_post_meta($value->ID, 'thread_status', true),
            ];
        };

        return new WP_REST_Response([
            'success' => true,
            'board' => $result_board,
            'threads' => $result_threads,
        ], 200);
    }

    function edit_current_board_api(WP_REST_Request $request) {
        $params = $request->get_json_params();
        if (empty($params) || empty($params['id'])) {
            return new WP_Error('not_defined', 'Недостоверные данные', ["success" => false, "status" => 400]);
        }

        $id = $params['id'];
        $post = get_posts([
            'include' => $id,
            'post_status' => 'publish',
            'post_type' => 'board',
        ]);
        
        if (empty($post)) {
            return new WP_Error('board_not_found', 'Доска не была найдена', ["success" => false, "status" => 404]);
        }
        $board = $post[0];

        $current_name = $board->post_title;
        $current_description = get_post_meta($board->ID, 'board_description', true);
        $current_mark = get_post_meta($board->ID, 'board_mark', true);

        $new_name = isset($params['name']) ? $params['name'] : $board->post_title;
        $new_description = isset($params['description']) ? $params['description'] : $current_description;
        $new_mark = isset($params['mark']) ? $params['mark'] : $current_mark;

        if($current_name === $new_name && $current_description === $new_description && $current_mark === $new_mark) {
            return new WP_REST_Response([
                "success" => true,
                "board" => null,
            ], 204);
        }

        $new_data = [
            'ID' => $id,
            'post_title' => $new_name,
            'meta_input' => [
                'board_description' => $new_description,
                'board_mark' => $new_mark
            ]
        ];
        $post_id = wp_update_post($new_data);
        
        if(is_wp_error($post_id)) {
            return new WP_Error(
                'server_error', 
                'Ошибка на стороне сервера', 
                [
                    "status" => 500, 
                    "success" => false, 
                    "details" => $post_id->get_error_message()
                ]
            );

        }

        $result = [
            'id' => $board->ID,
            'name' => $new_name,
            'description' => $new_description,
            'mark' => $new_mark,
            'author' => $board->post_author,
            'createdAt' => $board->post_date
        ];

        return new WP_REST_Response([
            "success" => true,
            "board" => $result,
        ]);
    }

    function delete_current_board_api(WP_REST_Request $request) {
        $mark = $request->get_param('mark');
        if(empty($mark)) {
            return new WP_Error('not_defined', 'Недостоверные данные', ["status" => 400, "success" => false]);
        }

        $relative_threads = get_posts([
            'posts_per_page' => -1,
            'post_type' => 'thread',
            'meta_key' => 'board_mark',
            'meta_value' => $mark,
            'post_status' => 'any'
        ]);
        foreach($relative_threads as $thread) {
            $relative_posts = get_posts([
                'posts_per_page' => -1,
                'post_type' => 'thread_post',
                'meta_key' => 'thread_id',
                'meta_value' => $thread->ID,
                'post_status' => 'any'
            ]);
            
            foreach($relative_posts as $post) {
                wp_delete_post($post->ID, true);
            }

            wp_delete_post($thread->ID, true);
        }

        $post_id = get_posts([
            'posts_per_page' => 1,
            'post_type' => 'board',
            'meta_key' => 'board_mark',
            'meta_value' => $mark,
            'post_status' => 'publish'
        ]);
        $board_id = $post_id[0]->ID;

        $post_deletion = wp_delete_post($board_id, true);
        if(!$post_deletion) {
            return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500, "success" => false]);
        }

        return new WP_REST_Response([
            "success" => true,
            "mark" => $mark,  
        ], 200);
    }
?>
