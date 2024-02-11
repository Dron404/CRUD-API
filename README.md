# CRUD-API

# RU 

## Команды npm

Есть 4 способа запустить приложение:

- `npm run start`: Просто запустить приложение.
- `npm run start:dev`: Запустить приложение в режиме разработки.
- `npm run start:prod`: Собрать приложение и запустить сборку из `./dist`.
- `npm run start:multi`: Запустить приложение в мультирежиме.

Тесты:

- `npm run test`: Запустить тесты.

## Реализованные Эндпоинты

### `api/users`

#### GET `/api/users`

- Используется для получения всех записей о пользователях.
  - **Ответ**:
    - Код состояния: 200
    - Тело: Все записи о пользователях.

#### GET `/api/users/{userId}`

- Используется для получения конкретной записи о пользователе по `userId`.
  - **Параметры**:
    - `userId`: Уникальный идентификатор пользователя.
  - **Ответы**:
    - Код состояния: 200
      - Тело: Запись о пользователе с указанным `userId`.
    - Код состояния: 400
      - Тело: Соответствующее сообщение, если `userId` недействителен (не является действительным UUID).
    - Код состояния: 404
      - Тело: Соответствующее сообщение, если запись с `id === userId` не существует.

#### POST `/api/users`

- Используется для создания новой записи о пользователе.
  - **Тело запроса**:
    - Обязательные поля: `username`, `age`, `hobbies`.
  - **Ответы**:
    - Код состояния: 201
      - Тело: Созданная запись о пользователе.
    - Код состояния: 400
      - Тело: Подробные ошибки валидации, если тело запроса недействительно.
        - Пример:
          ```json
          {
            "username": "username is not a string",
            "age": "age is not a number",
            "age": "age must be between 0 and 120"
            "hobbies": "Invalid hobbies data type"
          }
          ```

#### PUT `/api/users/{userId}`

- Используется для обновления существующей записи о пользователе.
  - **Параметры**:
    - `userId`: Уникальный идентификатор пользователя.
  - **Тело запроса**:
    - Поля для обновления.
  - **Ответы**:
    - Код состояния: 200
      - Тело: Обновленная запись о пользователе.
    - Код состояния: 400
      - Тело: Соответствующее сообщение, если `userId` недействителен (не является действительным UUID).
    - Код состояния: 404
      - Тело: Соответствующее сообщение, если запись с `id === userId` не существует.
    - Тело: Подробные ошибки валидации, если тело запроса недействительно.
        - Пример:
          ```json
          {
            "username": "username is not a string",
            "age": "age is not a number",
            "age": "age must be between 0 and 120"
            "hobbies": "Invalid hobbies data type"
          }
          ```

#### DELETE `/api/users/{userId}`

- Используется для удаления существующей записи о пользователе.
  - **Параметры**:
    - `userId`: Уникальный идентификатор пользователя.
  - **Ответы**:
    - Код состояния: 204
      - Тело: Нет содержимого.
    - Код состояния: 400
      - Тело: Соответствующее сообщение, если `userId` недействителен (не является действительным UUID).
    - Код состояния: 404
      - Тело: Соответствующее сообщение, если запись с `id === userId` не существует.

### Общие Замечания

- Если запрос отправлен на несуществующий эндпоинт, сервер возвращает код состояния 404 вместе с следующим телом ответа:
  ```json
  {
    "message": "Cannot URL",
    "error": "Not Found",
    "statusCode": 404
  }

#EN

## npm Commands

We have 4 ways to run the app:

- `npm run start`: Just run the app.
- `npm run start:dev`: Run the app in dev mode.
- `npm run start:prod`: Build the app and run the build from `./dist`.
- `npm run start:multi`: Run the app in multi mode.
  
Test:

- `npm run test`: Run the tests.

## Implemented Endpoints

### `api/users`

#### GET `/api/users`

- Used to retrieve all user records.
  - **Response**: 
    - Status Code: 200
    - Body: All user records.

#### GET `/api/users/{userId}`

- Used to retrieve a specific user record by `userId`.
  - **Parameters**:
    - `userId`: The unique identifier of the user.
  - **Responses**:
    - Status Code: 200
      - Body: The user record with the specified `userId`.
    - Status Code: 400
      - Body: Corresponding message if `userId` is invalid (not a valid UUID).
    - Status Code: 404
      - Body: Corresponding message if no record with `id === userId` exists.

#### POST `/api/users`

- Used to create a new user record.
  - **Request Body**:
    - Required Fields: `username`, `age`, `hobbies`
  - **Responses**:
    - Status Code: 201
      - Body: The created user record.
    - Status Code: 400
      - Body: Detailed validation errors if request body is invalid.
        - Example:
          ```json
          {
            "username": "username is not a string",
            "age": "age is not a number",
            "age": "age must be between 0 and 120"
            "hobbies": "Invalid hobbies data type"
          }
          ```
#### PUT `/api/users/{userId}`

- Used to update an existing user record.
  - **Parameters**:
    - `userId`: The unique identifier of the user.
  - **Request Body**:
    - Fields to update.
  - **Responses**:
    - Status Code: 200
      - Body: The updated user record.
    - Status Code: 400
      - Body: Corresponding message if `userId` is invalid (not a valid UUID).
    - Status Code: 404
      - Body: Corresponding message if no record with `id === userId` exists.
    - Body: Detailed validation errors if request body is invalid.
        - Example:
          ```json
          {
            "username": "username is not a string",
            "age": "age is not a number",
            "age": "age must be between 0 and 120"
            "hobbies": "Invalid hobbies data type"
          }
          ```

#### DELETE `/api/users/{userId}`

- Used to delete an existing user record.
  - **Parameters**:
    - `userId`: The unique identifier of the user.
  - **Responses**:
    - Status Code: 204
      - Body: No content.
    - Status Code: 400
      - Body: Corresponding message if `userId` is invalid (not a valid UUID).
    - Status Code: 404
      - Body: Corresponding message if no record with `id === userId` exists.

### General Notes

- If a request is made to a non-existent endpoint, the server returns a status of 404 along with the following response body:
  ```json
  {
    "message": "Cannot URL",
    "error": "Not Found",
    "statusCode": 404
  }
  ```
- Request body validation is enforced, and extra fields in the request will result in an error and a status of 400. Example response body:

```json
{
  "message": {
    "0": "property id should not exist",
    "1": "property surname should not exist",
    "2": "property weight should not exist",
  }
}
```
- JSON format errors in the request will also lead to a status of 400, accompanied by the following response body:

```json
{
  "message": "Invalid request Body: Expected ',' or '}' after property value in JSON at position 100"
}
```




