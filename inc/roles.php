<?php
    add_action('init', function() {
        if (!get_role('user')) {
            add_role('user', 'user', [
                'read' => true,
                'edit_posts' => true,
                'upload_files' => true
            ]);
        }
    });
?>