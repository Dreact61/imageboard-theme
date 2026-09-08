<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', function() {
    wp_enqueue_script(
        'imageboard-proj',
        get_template_directory_uri() . '/build/index.js',
        array(),
        '1.0.0',
        true
    );

    wp_localize_script('imageboard-proj', 'wpApiSettings', array(
        'nonce' => wp_create_nonce('wp_rest')
    ));

    $css_path = 'build/output.css';
    if(file_exists(get_theme_file_path($css_path))) {
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
?>