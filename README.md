# D-CHAN (имиджборд-проект с использованием технологии Headless CMS)

****

---

#### эндпоинты:

---

#### группировки требований эндпоинтов:

 - Доски - (name, description?, mark, author?, createdAt?)
 - Треды - (name, description?, parent, author?, createdAt?, status?)
 - Посты - (content, author?, createdAt?, parent)
 - Юзеры - (username, name?, description?, role, password?)

 (? - необязательные параметры)

---

#### группировки ошибок `WP_Error()`:

 - `server_error` ("Ошибка на стороне сервера") - код 500;
 - `missing_fields` ("Не все важные поля были заполнены") - код 400;
 - `author_not_defined` ("Пользователь не найден или не зарегистрирован") - код 401;
 - `username_taken` ("Такое имя уже занято") - код 400;
 - `board_not_found` ("Борд не был найден") - код 400;
 - `not_defined` ("Недостоверные данные") - код 400;