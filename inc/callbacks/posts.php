<?php
    function imageboard_create_post(WP_REST_Request $request) {
        $params = $request->get_json_params();

        $content = $params['content'];
        $author = $params['author'] ?? 'Anonymous';
        $parent = $params['parent'];

        $post_id = wp_insert_post([
            'post_type' => 'thread_post',
            'post_title' => "$author",
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

        $current_time = current_time("Y-m-d H:i:s");
        $new_title = "$author ($post_id) {$current_time}";

        wp_update_post([
            'ID' => $post_id,
            'post_title' => $new_title,
        ]);

        $result = [
            "id" => $post_id,
            "content" => $content,
            "author" => $author,
            "createdAt" => $current_time,
            "parent" => $parent,
        ];

        return new WP_REST_Response([
            'success' => true,
            'post' => $result,
        ], 201);
    }

    function delete_current_post_api(WP_REST_Request $request) {
        $id = $request->get_param('id');

        $post_deletion = wp_delete_post($id, true);
        if(!$post_deletion) {
            return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500, "success" => false]);
        }

        return new WP_REST_Response([
            "success" => true,
            "post_id" => $id,
        ]);
    }
?>