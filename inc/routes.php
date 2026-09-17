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
                        return is_string($param) && !username_exists($param);
                    }
                ],
                'password' => [
                    'type' => 'string',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_string($param) && strlen($param) >= 6;
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
        register_rest_route('myapi/v1', '/users/(?P<id>\d+)', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'fetch_current_user',
            'permission_callback' => '__return_true',
            'args' => [
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
        register_rest_route('myapi/v1', "/users/(?P<id>\d+)/edit", [
            'methods' => WP_REST_Server::EDITABLE,
            'callback' => 'handle_user_edit',
            'permission_callback' => function(WP_REST_Request $req) {
                $is_auth = mw_is_authenticated($req);
                if(!$is_auth) {
                    return $is_auth;
                }

                $user_id = get_current_user_id();
                $target_id = absint($req->get_param('id'));
                return $user_id === (int) $target_id;
            },
            'args' => [
                'username' => [
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
                        return is_string($param);
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
        register_rest_route('myapi/v1', '/users/(?P<id>\d+)/delete', [
            'methods' => WP_REST_Server::DELETABLE,
            'callback' => 'handle_user_deletion',
            'permission_callback' => function(WP_REST_Request $req) {
                $is_admin = mw_is_admin($req);
                if ($is_admin) {
                    return true;
                }
                
                $is_auth = mw_is_authenticated($req);
                if (is_wp_error($is_auth)) {
                    return $is_auth;
                }

                $user_id = get_current_user_id();
                $target_id = absint($req->get_param('id'));
                return $user_id === (int)$target_id;
            },
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
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'handle_user_logout',
            'permission_callback' => 'mw_is_authenticated'
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
        register_rest_route('myapi/v1', "/boards/(?P<id>\d+)", [
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'fetch_current_board_api',
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                    'validate_callback' => function($param) {
                        return is_numeric($param);
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
        register_rest_route('myapi/v1', "/boards/(?P<mark>[a-zA-Z0-9]+)/edit", [
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
        register_rest_route('myapi/v1', '/boards/(?P<id>\d+)/delete', [
            'methods' => 'DELETE',
            'callback' => 'delete_current_board_api',
            'permission_callback' => function(WP_REST_Request $req) {
                $is_admin = mw_is_admin($req);
                if ($is_admin) {
                    return true;
                }

                return mw_is_board_owner($req);
            },
            'args' => [
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

    //=========================
    // THREADS
    //=========================

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/(?P<parent>[a-zA-Z0-9]\d+)/(?P<id>\d+)", [
            'methods' => WP_REST_Server::READABLE,
            'callback' => 'fetch_current_thread_api',
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'type' => 'string',
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
                        return is_numeric($param);
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
                        return is_string($param);
                    }
                ],
            ],
        ]);
    });

    add_action('rest_api_init', function() {
        register_rest_route('myapi/v1', "/threads/(?P<id>\d+)/edit", [
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
                'status' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                    'enum' => ['PRIVATE', 'PUBLIC'],
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
        register_rest_route('myapi/v1', "/threads/(?P<id>\d+)/delete", [
            'methods' => 'DELETE',
            'callback' => 'delete_current_thread_api',
            'permission_callback' => function(WP_REST_Request $req) {
                $is_admin = mw_is_admin($req);
                if ($is_admin) {
                    return true;
                }

                $is_board_owner = mw_is_board_owner($req);
                if ($is_board_owner) {
                    return true;
                }
                
                return mw_is_thread_owner($req);
            },
            'args' => [
                'id' => [
                    'type' => 'integer',
                    'required' => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => function ($param) {
                        return is_numeric($param);
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
            'permission_callback' => function(WP_REST_Request $req) {
                $is_admin = mw_is_admin($req);
                if ($is_admin) {
                    return true;
                }

                $is_thread_owner = mw_is_thread_owner($req);
                if ($is_thread_owner) {
                    return true;
                }

                return mw_is_post_author($req);
            },
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
