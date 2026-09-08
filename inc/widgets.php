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

    $boards_count = wp_count_posts('boards')->publish ?? 0;

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
?>