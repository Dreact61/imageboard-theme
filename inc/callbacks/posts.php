<?php
function imageboard_create_post(WP_REST_Request $request)
{
    $content = $request->get_param('content');
    $author = $request->get_param('author') ?? 'Аноним';
    $parent = $request->get_param('parent');
    $image = $request->get_param('image') ?? '';


    $post_id = wp_insert_post([
        'post_type' => 'thread_post',
        'post_title' => "$author",
        'post_content' => $content,
        'post_status' => 'publish',
        'post_author' => get_current_user_id(),
        'meta_input' => [
            'post_author' => $author,
            'thread_id' => $parent,
            'thread_image' => $image
        ],
    ]);
    if (is_wp_error($post_id)) {
        return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500]);
    }

    $image_log = '';
    $files = $request->get_file_params();
    if (!empty($files['image'])) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        $attachment_id = media_handle_upload('image', $post_id);
        if (!is_wp_error($attachment_id)) {
            set_post_thumbnail($post_id, $attachment_id);
        } else {
            $image_log = $attachment_id;
        }
    }

    $current_time = current_time("Y-m-d H:i:s", $post_id);
    $new_title = "$author ($post_id) {$current_time}";

    wp_update_post([
        'ID' => $post_id,
        'post_title' => $new_title,
    ]);

    $post = get_post($post_id);

    $result = [
        "id" => $post->ID,
        "content" => $post->post_content,
        "author" => get_post_meta($post->ID, 'post_author', true),
        "createdAt" => get_the_date('Y-m-d H:i:s', $post->ID),
        "parent" => get_post_meta($post->ID, 'thread_id', true),
        "image" => has_post_thumbnail($post->ID) ? get_the_post_thumbnail_url($post->ID, 'full') : ''
    ];

    return new WP_REST_Response([
        'success' => true,
        'post' => $result,
    ], 201);
}

function delete_current_post_api(WP_REST_Request $request)
{
    $id = $request->get_param('id');

    $post_deletion = wp_delete_post($id, true);
    if (!$post_deletion) {
        return new WP_Error('server_error', 'Ошибка на стороне сервера', ["status" => 500, "success" => false]);
    }

    return new WP_REST_Response([
        "success" => true,
        "post_id" => $id,
    ], 200);
}

function nuke_all_parentless_posts() {
    $all = get_posts([
        'numberposts' => -1,
        'post_type' => 'thread_post',
        'post_status' => 'any'
    ]);

    $deleted_id = [];
    foreach($all as $post) {
        $post_parent = get_post_meta($post->ID, 'thread_id', true);
        if ($post_parent === null) {
            wp_delete_post($post->ID, true);
            $deleted_id[] = $post->ID;
        }
    }
}

add_action('init', 'nuke_all_parentless_posts', 20);