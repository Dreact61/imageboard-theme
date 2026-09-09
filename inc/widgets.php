<?php
add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'main_element',
        'Основная сводка данных D-CHAN',
        'render_main_element'
    );
});

function render_main_element() {
    $users = count_users();
    $total_users = $users['total_users'];

    $role_user = $users['avail_roles']['user'] ?? 0;

    $boards_count = wp_count_posts('board')->publish ?? 0;

    ?>
    <style>

    </style>

    <div class="main">
        <header>Краткая сводка</header>
        <section class="wp_stats_container">
            <div class="card">
                <h4>Всего пользователей</h4>
                <div class="wp-number"><?php echo esc_html($total_users); ?></div>
            </div>

            <div class="card">
                <h4>Активных досок</h4>
                <div class="wp-number"><?php echo esc_html($boards_count); ?></div>
            </div>

            <div class="wp-footer">
                <ul>
                    <li>• Пользователей с ролью <strong>User</strong>: <?php echo esc_html($role_user); ?></li>
                    <li>• API-префикс: <code>/wp-json/myapi/v1/</code></li>
                </ul>
            </div>
        </section>
    </div>
    <?php
}

//==================================
// BOARDS
//==================================

add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'boards_widget',
        'Доски (Boards)',
        'render_boards_info'
    );
});

function render_boards_info() {
    $boards_total = wp_count_posts('boards')->publish ?? 0;
    
    $special_boards = get_posts([
        'posts_per_page' => 3,
        'post_status' => 'publish',
        'post_type' => 'board',
        'meta_key' => 'board_author',
        'meta_value' => 'D-Chan'
    ]);

    $recent_created_boards = get_posts([
        'posts_per_page' => 5,
        'post_status' => 'publish',
        'post_type' => 'board'
    ]);
    ?>
    <style></style>

    <div class="main">
        <header>Доски</header>
        <section class="wp-stats-container">
            <div class="card">
                <h4>Всего активных досок</h4>
                <div class="wp-number"><?php echo esc_html($boards_total); ?></div>
            </div>
            <div class="card">
                <h4>Доски, созданные автором</h4>
                <div class="wp-number"><?php 
                if (!$special_boards) {
                    echo "Таких досок пока не было.";
                }
                foreach ($special_boards as $board) {
                    echo esc_html($board->post_title);
                }
                ?></div>
            </div>
            <div class="card">
                <h4>Последние созданные доски:</h4>
                <?php if (empty($recent_created_boards)) : ?>
                    <p class="description">Досок пока нет.</p>
                <?php else : ?>
                    <ul style="padding-left:15px; margin:5px 0;">
                        <?php foreach ($recent_created_boards as $board) : ?>
                            <li>• <?php echo esc_html($board->post_title); ?></li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>
        </section>
    </div>
    <?php
}

//==================================
// THREADS
//==================================

add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'threads_widget',
        'Треды (Threads)',
        'render_threads_info'
    );
});

function render_threads_info() {
    $threads_total = get_posts([
        'posts_per_page' => 1,
        'post_type' => 'thread',
        'post_status' => 'publish'
    ]);

    $last_id = wp_count_posts('thread')->publish ?? 0;
    $last_thread = get_post($last_id, 'thread');

    $relative_board_id = get_post_meta($last_thread->ID, 'board_id', true);
    $board_name = get_post($relative_board_id, 'board')->post_title;

    ?>
    <style></style>

    <div class="main">
        <header>Треды</header>
        <section class="wp-stats-container">
            <div class="card">
                <h4>Общее кол-во тредов</h4>
                <div class="wp-number"><?php echo esc_html(count($threads_total)); ?></div>
            </div>
            <div class="card">
                <h4>Последний созданный тред</h4>
                <div class="wp-number"><?php
                    if (!$threads_total) {
                        echo "Пока созданных тредов не было.";
                        
                    } else {
                        echo "Имя доски -> $board_name";
                        echo "Тред -> $last_thread->post_title";
                    }
                ?></div>
            </div>
        </section>
    </div>
    <?php
}

//==================================
// POSTS
//==================================

add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'posts_widget',
        'Посты тредов (Posts)',
        'render_posts_info'
    );
});

function render_posts_info() {
    $posts_total = wp_count_posts('thread_posts')->publish ?? 0;

    $last_written_post = get_post($posts_total, 'thread_post');
    $relative_thread = get_post($last_written_post->ID, 'thread');
    $relative_board = get_post($relative_thread->ID, 'board');

    $trimmed_post = wp_trim_words($last_written_post->post_content, 10, '...');
    ?>
    <style></style>

    <div class="main">
        <header>Посты</header>
        <section class="wp-stats-container">
            <div class="card">
                <h4>Общее кол-во постов</h4>
                <div class="wp-number"><?php echo esc_html($posts_total); ?></div>
            </div>
            <div class="card">
                <h4>Последний оставленный пост</h4>
                <div class="wp-number"><?php
                    if($posts_total === 0) {
                        echo "Постов пока нет.";
                    } else {
                        echo "Имя доски -> $relative_board->post_title";
                        echo "Имя треда -> $relative_thread->post_title";
                        echo "Содержание поста -> $trimmed_post";
                    }
                ?></div>
            </div>
        </section>
    </div>
    <?php
}

//==================================
// USERS
//==================================

add_action('wp_dashboard_setup', function() {
    wp_add_dashboard_widget(
        'users_widget',
        'Пользователи',
        'render_users_info'
    );
});

function render_users_info() {
    $users = count_users();
    $total_users = $users['total_users'];

    $role_user = $users['avail_roles']['user'] ?? 0;
    $role_admin = $users['avail_roles']['admin'] ?? 0;
    ?>
    <style></style>

    <div class="main">
        <header>Пользователи</header>
        <section class="wp-stats-container">
            <ul>
                <li>• Всего пользователей: <?php echo esc_html($total_users); ?></li>
                <li>• Пользователей с ролью <strong>User</strong>: <?php echo esc_html($role_user); ?></li>
                <li>• Пользователей с ролью <strong>Admin</strong>: <?php echo esc_html($role_admin); ?></li>
            </ul>
        </section>
    </div>
    <?php
}
?>