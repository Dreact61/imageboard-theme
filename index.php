<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D-Chan</title>
    <link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/build/output.css?v=<?php echo time(); ?>">
</head>
<body style="padding: 1rem">

    <div id="root">
        <h1 style="color: red;">Если ты видишь это, React еще не смонтировался в DOM!</h1>
    </div>

    <script src="<?php echo get_template_directory_uri(); ?>/build/index.js?v=<?php echo time(); ?>"></script>

</body>
</html>