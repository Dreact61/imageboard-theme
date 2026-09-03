<?php
    function imageboard_metafields() {
        register_post_meta('thread', 'board_id', [
            'type' => 'integer',
            'single' => true,
            'show_in_rest' => true,
            'sanitize_callback' => 'absint',
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            },
        ]);

        
    }
?>