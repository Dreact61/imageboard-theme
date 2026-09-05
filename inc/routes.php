<?php
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

    //=========================
    // BOARDS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/boards/(?P<mark>[a-zA-Z0-9]+)', [
            'methods' => 'WP_REST_Server::READABLE',
            'callback' => 'fetch_current_board_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'mark' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/boards/create', [
            'methods' => 'POST',
            'callback' => 'register_boards_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'mark' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'author' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'createdAt' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ]
            ]
        ]); 
    }); 

    //=========================
    // THREADS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/threads', [
            'methods' => 'POST',
            'callback' => 'imageboard_create_thread',
            'permission_callback' => '__return_true',
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ],
                'parent' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                ],
                'author' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'createdAt' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'status' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
        ]);
    });

    //=========================
    // POSTS
    //=========================

?>
