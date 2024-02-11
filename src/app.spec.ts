import App from './app';

const users = [
  { username: 'John', age: 30, hobbies: ['code', 'node.js', 'cafe'] },
  { username: 'Updated John', age: 35, hobbies: ['read'] },
];
describe('Test App scenario 1 check standard cases', () => {
  let app: App;
  let userId = '';
  beforeAll(() => {
    app = new App({ port: 3000 });
    app.start();
  });
  afterAll(() => {
    app.close();
  });

  test('GET /api/users should return an empty array', async () => {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    expect(data).toEqual([]);
  });

  test('POST /api/users should create a new object and return it', async () => {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(users[0]),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    const { id, ...user } = data;
    userId = id;
    expect(user).toEqual(users[0]);
  });

  test('GET /api/users/{userId} should return the created record by its id', async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`);
    const data = await response.json();
    expect(data.id).toEqual(userId);
  });
  test('PUT /api/users/{userId} should update the created record', async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(users[1]),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    const { username, age, hobbies } = data;
    expect({ username, age, hobbies }).toEqual(users[1]);
  });
  test('DELETE /api/users/{userId} should delete the created object by id', async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'DELETE',
    });
    expect(response.status).toEqual(204);
  });
  test('GET /api/users/{userId} should return 404 status code', async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`);
    expect(response.status).toEqual(404);
  });
});

describe('Test App scenario 2 check server responses if something goes wrong', () => {
  let app: App;
  beforeAll(() => {
    app = new App({ port: 3001 });
    app.start();
  });
  afterAll(() => {
    app.close();
  });

  test('POST /api/users should answer with status code 400 and corresponding message if request body does not contain required fields', async () => {
    const response = await fetch('http://localhost:3001/api/users/', {
      method: 'POST',
      body: JSON.stringify({ name: 'Jane' }),
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toEqual(400);
  });

  test('GET /api/users/{userId}  should return 400 if id is invalid uuid', async () => {
    const response = await fetch(`http://localhost:3001/api/users/12345-я_иду_тебя_искать`);
    expect(response.status).toEqual(400);
  });
  test('PUT /api/users/{userId} should 400  if userId is invalid and 404 if user is not exist', async () => {
    const response = await fetch(`http://localhost:3001/api/users/12345-я_иду_тебя_искать`, {
      method: 'PUT',
      body: JSON.stringify(users[0]),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status).toEqual(400);

    const response2 = await fetch(`http://localhost:3001/api/users/c1a9d7b3-d749-4b98-b570-348a1652d088`, {
      method: 'PUT',
      body: JSON.stringify(users[0]),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response2.status).toEqual(404);
  });
  test('DELETE /api/users/{userId} should delete the created object by id', async () => {
    const response = await fetch(`http://localhost:3001/api/users/c1a9d7b3-d749-4b98-b570-348a1652d088`, {
      method: 'DELETE',
    });
    expect(response.status).toEqual(404);
  });
  test('GET /api/users/{userId} should return  404 if user is not exist', async () => {
    const response = await fetch(`http://localhost:3001/api/c1a9d7b3-d749-4b98-b570-348a1652d088`);
    expect(response.status).toEqual(404);
  });
});

describe('Test App scenario 3', () => {
  let app: App;
  let userId = '';
  beforeAll(() => {
    app = new App({ port: 3000 });
    app.start();
  });
  afterAll(() => {
    app.close();
  });

  const newUser = { username: 'John', age: 30, hobbies: ['code', 'node.js', 'cafe'] };
  const updatedUser = { username: 'Updated John', age: 35, hobbies: ['read'] };

  test('PUT /api/users/{userId} should return 200 and updated record if request is valid', async () => {
    const createResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: { 'Content-Type': 'application/json' },
    });
    const createdUser = await createResponse.json();
    userId = createdUser.id;
    const updateResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser),
      headers: { 'Content-Type': 'application/json' },
    });
    const updatedUserResponse = await updateResponse.json();

    expect(updateResponse.status).toEqual(200);
    expect(updatedUserResponse).toEqual(expect.objectContaining(updatedUser));
  });

  test('PUT /api/users/{userId} should return 400 if userId is invalid', async () => {
    const response = await fetch('http://localhost:3000/api/users/invalidUserId', {
      method: 'PUT',
      body: JSON.stringify(updatedUser),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status).toEqual(400);
  });

  test('PUT /api/users/{userId} should return 404 if record does not exist', async () => {
    const response = await fetch('http://localhost:3000/api/users/c1a9d7b3-d749-4b98-b570-348a1652d088', {
      method: 'PUT',
      body: JSON.stringify(updatedUser),
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status).toEqual(404);
  });

  test('GET /api/users/ should return valid array of users', async () => {
    for (const user of users) {
      await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    expect(data.length).toEqual(3);
  });
});
