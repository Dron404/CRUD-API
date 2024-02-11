# CRUD-API

#### npm Commands

- we have 3 ways to run the app
- npm run start - just run the app
- npm run start:dev - run the app in dev mode
- npm run start:prod - build the app in run the build from ./dist
- npm run start:multi - run the app in multi mode
- npm run test - run the tests

### Implemented endpoint `api/users`:

    - **GET** `api/users` is used to get all persons
        - Server should answer with `status code` **200** and all users records
    - **GET** `api/users/{userId}`
        - Server should answer with `status code` **200** and record with `id === userId` if it exists
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **POST** `api/users` is used to create record about new user and store it in database
        -  **201** user created
        -  **400** if request `body` does not contain **required** fields
         "message": {
        "0": "username is not a string",
        "1": "age is not a number",
        "2": "Invalid hobbies data type"
       }
       also endpoint have validation
       {
        "1": "Invalid hobbies data type",
        "2": "age must be between 0 and 120"
       }
    - **PUT** `api/users/{userId}` is used to update existing user
        - Server should answer with` status code` **200** and updated record
        - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
        - Server should answer with `status code` **204** if the record is found and deleted
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **For All**
        - If
