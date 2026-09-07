<?php
    function imageboard_metafields() {
    //================================================
    // BOARDS
    //================================================
        register_post_meta('board', 'board_mark', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            },
        ]);

        register_post_meta('board', 'board_description', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_textarea_field',
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            },
        ]);

        register_post_meta('board', 'board_author', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            }
        ]);

    //================================================
    // THREADS
    //================================================
        
        register_post_meta('thread', 'board_mark', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => function() {
                return true;
            },
        ]);

        register_post_meta('thread', 'thread_description', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_textarea_field',
            'auth_callback' => function() {
                return true;
            },
        ]);

        register_post_meta('thread', 'thread_author', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => function() {
                return true;
            },
        ]);

        register_post_meta('thread', 'thread_status', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => function($value) {
                if (empty($value)) {
                    return $value;
                }
                $allowed = ['PUBLIC', 'PRIVATE'];
                $value = strtoupper(sanitize_text_field($value));
                return in_array($value, $allowed, true) ? $value : 'PUBLIC';
            },
            'auth_callback' => function() {
                return true;
            },
        ]);

    //================================================
    // POSTS
    //================================================
        
        register_post_meta('thread_post', 'thread_id', [
            'type' => 'integer',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'absint',
            'auth_callback' => function() {
                return true;
            },
        ]);

        register_post_meta('thread_post', 'post_author', [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback' => function() {
                return true;
            },
        ]);
    }

    add_action('init', 'imageboard_metafields');
?>
