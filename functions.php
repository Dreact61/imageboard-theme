<?php
if (!defined('ABSPATH')) {
    exit;
}

add_action('wp-enqueue_scripts', function() {
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
?>