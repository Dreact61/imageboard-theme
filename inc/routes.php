<?php
    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/register', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'handle_user_register',
            'permission_callback' => '__return_true',
            'args' => [
                'username' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && !username_exists($param) && mb_strlen($param) >= 4;
                    }
                ],
                'password' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && mb_strlen($param) >= 6;
                    }
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/users/fetch', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'fetch_current_user',
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && (int)$param > 0;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/login', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'handle_user_login',
            'permission_callback' => '__return_true',
            'args' => array(
                'username' => array(
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ),

                'password' => array(
                    'required' => true,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                )
            )
        ));
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/users/edit", [
            'methods' => WP_REST_Server::EDITABLE,
            'callback' => 'handle_user_edit',
            'permission_callback' => 'mw_can_edit_user',
            'args' => [
                'username' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return (is_string($param) && mb_strlen($param) >= 4) || is_null($param);
                    }
                ],
               'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param) || is_null($param);
                    }
                ],
                'password' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return (is_string($param) && mb_strlen($param) >= 6) || is_null($param);
                    }
                ],
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && (int)$param > 0;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/users/delete', [
            'methods' => WP_REST_Server::ALLMETHODS,
            'callback' => 'handle_user_deletion',
            'permission_callback' => 'mw_can_edit_user',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && (int)$param > 0;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/logout', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'handle_user_logout',
            'permission_callback' => '__return_true'
        ]);
    });

    //=========================
    // BOARDS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/boards/all', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'fetch_all_boards_api',
            'permission_callback' => '__return_true'
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/boards", [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'fetch_current_board_api',
            'permission_callback' => '__return_true',
            'args' => [
                'mark' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && mb_strlen($param) > 0;
                    }
                ],
            ],
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/boards/create', [
            'methods' => 'POST',
            'callback' => 'register_boards_api',
            'permission_callback' => 'mw_is_authenticated',
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param) || is_null($param);
                    }
                ],
                'mark' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'author' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ]
            ]
        ]); 
    }); 

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/boards/edit", [
            'methods' => 'PUT',
            'callback' => 'edit_current_board_api',
            'permission_callback' => 'mw_is_board_owner',
            'args' => [
                'name' => [                     
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'mark' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/boards/delete', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'delete_current_board_api',
            'permission_callback' => 'mw_is_board_owner',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ]
            ]
        ]);
    });

    //=========================
    // THREADS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads", [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'fetch_current_thread_api',
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/threads/create', [
            'methods' => 'POST',
            'callback' => 'imageboard_create_thread',
            'permission_callback' => 'mw_is_authenticated',
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param) || is_null($param);
                    }
                ],
                'parent' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'author' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'status' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && in_array($param, ['PUBLIC', 'PRIVATE'], true);
                    }
                ],
                'password' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && mb_strlen($param) >= 6;
                    }
                ]
            ],
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/edit", [
            'methods' => 'PUT',
            'callback' => 'edit_current_thread_api',
            'permission_callback' => 'mw_is_thread_owner',
            'args' => [
                'name' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'description' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'password' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && mb_strlen($param) >= 6;
                    }
                ],
                'status' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && in_array($param, ['PUBLIC', 'PRIVATE'], true);
                    }
                ],
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/delete", [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'delete_current_thread_api',
            'permission_callback' => 'mw_is_thread_owner',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function ($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/threads/private-pass', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'handle_private_thread_pass_api',
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function ($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ],
                'password' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && mb_strlen($param) >= 6;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', '/threads/password', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'handle_thread_password_output_api',
            'permission_callback' => 'mw_is_thread_owner',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
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
            'permission_callback' => '__return_true',
            'args' => [
                'content' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_textarea_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && mb_strlen($param) > 0;
                    }
                ],
                'author' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param);
                    }
                ],
                'parent' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ],
                'image_url' => [
                    'type' => 'string',
                    'required' => false,
                    'description' => 'Ссылка на внешнее изображение',
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) || is_null($param) || is_link($param) || is_object($param);
                    }
                ],
                'image_file' => [
                    'required' => false,
                    'description' => 'Файл изображения с пк',
                    'validate_callback' => function($param) {
                        return isset($_FILES[$param]) && $_FILES[$param]['error'] === UPLOAD_ERR_OK;
                    }
                ]
            ]
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/posts/delete", [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'delete_current_post_api',
            'permission_callback' => 'mw_is_post_owner',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function($param) {
                        return is_numeric($param) && $param > 0;
                    }
                ]
            ]
        ]);
    });
?>