<?php
    function imageboard_create_post(WP_REST_Request $request) {
        $params = $request->get_json_params();

        if (empty($params['content']) || empty($params['parent'])) {
            return new WP_Error('missing_fields', 'Не все важные поля были заполнены', ["status" => 400]);
        }

        $content = sanitize_textarea_field($params['content']);
        $author = isset($params['author']) && $params['author'] !== 'Anonymous' ? sanitize_text_field($params['author']) : 'Anonymous';
        $createdAt = isset($params['createdAt']) ? sanitize_text_field($params['createdAt']) : 'N/A';
        $parent = absint($params['parent']);

        $post_id = wp_insert_post([
            'post_type' => 'thread_post',
            'post_title' => "$author - $createdAt",
            'post_content' => $content,
            'post_status' => 'publish',
            'post_author' => get_current_user_id(),
            'meta_input' => [
                'post_author' => $author,
                'thread_id' => $parent
            ],
        ]);

        if (is_wp_error($post_id)) {
            return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500]);
        }

        $result = [
            "id" => $post_id,
            "content" => $content,
            "author" => $author,
            "createdAt" => $createdAt,
            "parent" => $parent,
        ];

        return new WP_REST_Response([
            'success' => true,
            'post' => $result,
        ], 201);
    }
?>