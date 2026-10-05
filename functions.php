<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_script(
        'imageboard-proj',
        get_template_directory_uri() . '/build/index.js',
        array(),
        '1.0.0',
        true
    );

    wp_localize_script(
        'imageboard-proj',
        'wpApiSettings',
        [
            'theme_url' => get_template_directory_uri(),
            'nonce' => wp_create_nonce('wp_rest')
        ]
    );

    $css_path = 'build/output.css';
    if (file_exists(get_theme_file_path($css_path))) {
        wp_enqueue_style(
            'theme-tailwind',
            get_theme_file_uri($css_path),
            array(),
            '1.0.0',
            filemtime(get_theme_file_path($css_path))
        );
    }
});

require_once __DIR__ . "/inc/roles.php";
require_once __DIR__ . "/inc/meta.php";
require_once __DIR__ . "/inc/routes.php";
require_once __DIR__ . "/inc/callbacks/register.php";
require_once __DIR__ . "/inc/callbacks/boards.php";
require_once __DIR__ . "/inc/callbacks/threads.php";
require_once __DIR__ . "/inc/callbacks/posts.php";
require_once __DIR__ . "/inc/widgets.php";

require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/inc/jwt-helper.php";
require_once __DIR__ . "/inc/middlewares.php";

add_filter('allowed_redirect_hosts', function ($hosts) {
    $hosts[] = 'localhost:8080';
    return $hosts;
});

add_action('after_setup_theme', function () {
    add_theme_support('post_thumbnails');
});

//-----

// function single_time_delete_all_cpt_boards() {
//     $boards = get_posts(array(
//         'post_type'   => 'board', 
//         'numberposts' => -1,
//         'post_status' => 'any'
//     ));

//     if (!empty($boards)) {
//         foreach ($boards as $board) {
//             wp_delete_post($board->ID, true); 
//         }
//         error_log('БАЗА ДАННЫХ: Все кастомные записи досок удалены.');
//     }
// }
// add_action('init', 'single_time_delete_all_cpt_boards');


// function single_time_delete_all_threads()
// {
//     $threads_total = get_posts([
//         'posts_per_page' => -1,
//         'post_type' => 'thread',
//         'post_status' => 'publish'
//     ]);

//     foreach ($threads_total as $thread) {
//         $relative_posts = get_posts([
//             'post_type' => 'thread_post',
//             'numberposts' => -1,
//             'post_status' => 'any',
//             'meta_key' => 'thread_id',
//             'meta_value' => $thread->ID
//         ]);
//         foreach ($relative_posts as $post) {
//             wp_delete_post($post->ID, true);
//         }

//         wp_delete_post($thread->ID, true);
//     }
// }

// add_action('init', 'single_time_delete_all_threads');
