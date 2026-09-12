# D-CHAN (имиджборд-проект с использованием технологии Headless CMS)

****

---

## эндпоинты:

> Основной адрес - **`http://localhost:8080/wp-json/myapi/v1`**

1. Пользователи (Users)
 - `/register`
 - `/login`
 - `/users/(user_id)`
   1. `/edit`
   2. `/delete`
2. Доски (Boards)
 - `/boards/(board_mark)`
   1. `/edit`
   2. `/delete`
 - `/boards/create`
3. Треды (Threads)
 - `/threads/(thread_id)`
   1. `/edit`
   2. `/delete`
 - `threads/create`
4. Посты (Posts)
 - `posts/create`
 - `posts/(post_id)/delete`

---

## группировки требований эндпоинтов и приходящие данные:

1. ### Доски:
  - `register_boards_api` (Создание доски):
        Принимает:
        - name (required string),
        - description (string),
        - mark (required string),
        - author (required string)
        Отдает:
        - success (true/false),
        - Board (Все данные касательно созданной доски)
        - Thread ([] - пустой массив принадлежащих доске тредов)

  - `fetch_current_board_api` (Парсинг конкретной доски):
        Принимает:
        - id (required integer)
        Отдает:
        - success (true/false),
        - Board (Все данные касательно этой доски),
        - Thread (Массив принадлежащих доске тредов)
  
  - `edit_current_board_api` (Изменение конкретной доски):
        Принимает:
        - id (required integer),
        - name (string),
        - description (string),
        - mark (string)
        Отдает:
        - success (true/false),
        - Board (Все данные касательно измененной доски в новом виде)
  
  - `delete_current_board_api` (Удаление доски):
        Принимает:
        - id (required)
        Отдает:
        - success (true/false),
        - id 

2. ### Треды
 - `fetch_current_thread_api` (Парсинг треда):
        Принимает:
        - id (required integer),
        Отдает:
        - success (true/false),
        - thread (Все данные о треде),
        - posts (Все принадлежащие треду посты)

  - `imageboard_create_thread` (Создание треда):
        Принимает:
        - name (required string),
        - description (string),
        - parent (required integer),
        - author (required string),
        - status (required 'PRIVATE' or 'PUBLIC')
        Отдает:
        - success (true/false),
        - thread (Все данные о треде),
        - posts ([] - пустой массив постов)
  
  - `edit_current_thread_api` (Изменение треда):
        Принимает:
        - id (required integer),
        - name (string),
        - description(string),
        - status (string)
        Отдает:
        - success (true/false),
        - thread (Измененные данные треда)

  - `delete_current_thread_api` (Удаление треда):
        Принимает:
        - id (required integer)
        Отдает:
        - success (true/false),
        - id

3. ### Посты
  - `imageboard_create_post` (Создание поста):
        Принимает:
        - content (required string),
        - author (required string),
        - parent (required integer)
        Отдает:
        - success (true/false),
        - post (Содержимое поста)
  
  - `delete_current_post_api` (Удаление поста):
        Принимает:
        - id (required integer)
        Отдает:
        - success (true/false),
        - id

4. ### Пользователи
  - `handle_user_register` (Регистрация):
        Принимает:
        - username (required string),
        - password (required string),
        - description (string)
        Отдает:
        - success (true/false),
        - user (Данные созданного пользователя)

  - `handle_user_login` (Вход в аккаунт):
        Принимает:
        - username (required string),
        - password (required string)
        Отдает:
        - success (true/false),
        - user (Данные залогиненного пользователя)

  - `handle_user_edit` (Изменение данных пользователя):
        Принимает:
        - id (required integer),
        - username (string),
        - description (string),
        - password (string)
        Отдает:
        - success (true/false),
        - user (Измененные данные пользователя)

  - `handle_user_deletion` (Удаление пользователя):
        Принимает:
        - id (required integer)
        Отдает:
        - success (true/false),
        - id

> **Ошибки, в свою очередь, возвращают следующие элементы:**
> **success (false)**
> **status (передаваемый код ошибки)**
> **details (на все CRUD операции, кроме удаления и чтения)**

---

## группировки ошибок `WP_Error()`:

 - `server_error` ("Ошибка на стороне сервера") - код 500;
 - `missing_fields` ("Не все важные поля были заполнены") - код 400;
 - `author_not_defined` ("Пользователь не найден или не зарегистрирован") - код 401;
 - `username_taken` ("Такое имя уже занято") - код 400;
 - `board_not_found` ("Доска не найдена") - код 404;
 - `thread_not_found` ("Тред не найден") - код 404
 - `not_defined` ("Недостоверные данные") - код 400;
 - `relative_threads_are_not_parsed` ("Не получилось достать треды, связанные с меткой (метка доски)") - код 404;
 - `nothing_to_change` ("Ничего не изменилось") - код 204;
 - `user_not_found` ("Пользователь не найден") - код 404;
 - `invalid_credentials` ("Неверный логин или пароль") - код 400;
 - `rest_forbidden` ("Вы не авторизованы") - код 401;
 - `invalid_token` ("Токен сломан или просрочен") - код 401;
 - `not_admin` ("Недостаточно прав") - код 403;
 - `error_unknown` ("Неизвестная ошибка") - код 500;