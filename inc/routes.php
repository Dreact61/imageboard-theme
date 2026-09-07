<?php
    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/login', array(
            'methods' => 'POST',
            'callback' => 'handle_user_login',
            'permission_callback' => '__return_true',
            'args' => array(
                'username' => array(
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param, $req, $key) {
                        return is_string($param);
                    }
                ),

                'password' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param, $req, $key) {
                        return is_string($param);
                    }
                )
            )
        ));
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/users/(?P<username>[a-zA-Z0-9]+)/edit", [
            'methods' => WP_REST_Server::EDITABLE,
            'callback' => 'handle_user_edit',
            'permission_callback' => function() {
                $id = get_current_user_id();
                //--------HERE
            }
        ]);
    });

    //=========================
    // BOARDS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/boards/(?P<mark>[a-zA-Z0-9]+)", [
            'methods' => WP_REST_Server::READABLE,
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
                    'sanitize_callback' => 'sanitize_textarea_field',
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
                ]
            ]
        ]); 
    }); 

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/boards/(?P<mark>[a-zA-Z0-9]+)/edit", [
            'methods' => 'PUT',
            'callback' => 'edit_current_board_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ],
                'mark' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint'
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/boards/(?P<mark>[a-zA-Z0-9]+)/delete', [
            'methods' => 'DELETE',
            'callback' => 'delete_current_board_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            }
        ]);
    });

    //=========================
    // THREADS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/(?P<id>\d+)", [
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'fetch_current_thread_api',
            'permission_callback' => '__return_true',
            'args' => [
                'mark' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field'
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/threads/create', [
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
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'author' => [
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

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/(?P<id>\d+)/edit", [
            'methods' => 'PUT',
            'callback' => 'edit_current_thread_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field'
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field'
                ],
                'status' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'enum' => ['PRIVATE', 'PUBLIC']
                ],
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint'
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/(?P<id>\d+)/delete", [
            'methods' => 'DELETE',
            'callback' => 'delete_current_thread_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                ]
            ]
        ]);
    });

    //=========================
    // POSTS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/posts/create', [
            'methods' => 'POST',
            'callback' => 'imageboard_create_post',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'content' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_textarea_field'
                ],
                'author' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
                'parent' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param, $req, $key) {
                        return is_numeric($param);
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/posts/post-(?P<id>\d+)/delete", [
            'methods' => 'DELETE',
            'callback' => 'delete_current_post_api',
            'permission_callback' => function() {
                return current_user_can('edit_posts');
            },
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint'
                ]
            ]
        ]);
    });

?>
