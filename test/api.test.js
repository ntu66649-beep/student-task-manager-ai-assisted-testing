const app = require('../src/app');
const assert = require('assert');

let server;
let baseUrl;
let authToken = '';

async function runTests() {
  console.log('========================================================');
  console.log('🧪 Starting Automated API Tests for Student Task Manager');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Reason: ${err.message}`);
      failed++;
    }
  }

  // Start temporary test server on random free port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`Test server running at ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // 1. Health Check
    await test('GET /api/health - returns 200 and UP status', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.status, 'UP');
    });

    // 2. Auth - Login Missing Fields
    await test('POST /api/auth/login - Failure (Missing Fields) returns 400', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'student' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.ok(data.message.includes('required'));
    });

    // 3. Auth - Login Invalid Credentials
    await test('POST /api/auth/login - Failure (Invalid Credentials) returns 401', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'student', password: 'wrongpassword' })
      });
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    // 4. Auth - Login Success
    await test('POST /api/auth/login - Success returns 200 and auth token', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'student', password: 'password123' })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.data.token, 'Token must exist in response');
      authToken = data.data.token;
    });

    // 5. Tasks - Unauthorized access (No token)
    await test('GET /api/tasks - Failure (No Token) returns 401', async () => {
      const res = await fetch(`${baseUrl}/api/tasks`);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    // 6. Tasks - Unauthorized access (Invalid token)
    await test('GET /api/tasks - Failure (Invalid Token) returns 401', async () => {
      const res = await fetch(`${baseUrl}/api/tasks`, {
        headers: { Authorization: 'Bearer invalid-token-999' }
      });
      assert.strictEqual(res.status, 401);
    });

    // 7. Tasks - Get All Tasks (Authorized)
    await test('GET /api/tasks - Success returns 200 and list of tasks', async () => {
      const res = await fetch(`${baseUrl}/api/tasks`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.data));
      assert.ok(data.data.length >= 3);
    });

    // 8. Tasks - Get Task by ID (Found)
    await test('GET /api/tasks/1 - Success returns 200 and specific task', async () => {
      const res = await fetch(`${baseUrl}/api/tasks/1`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.id, 1);
    });

    // 9. Tasks - Get Task by ID (Not Found)
    await test('GET /api/tasks/9999 - Failure (Not Found) returns 404', async () => {
      const res = await fetch(`${baseUrl}/api/tasks/9999`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 404);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    // 10. Tasks - Create Task (Missing Title)
    await test('POST /api/tasks - Failure (Missing Title) returns 400', async () => {
      const res = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: 'No title given' })
      });
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    // 11. Tasks - Create Task (Success)
    let createdTaskId;
    await test('POST /api/tasks - Success returns 201 and created task', async () => {
      const res = await fetch(`${baseUrl}/api/tasks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Chuan bi thuyet trinh Postman',
          description: 'Demo cac test cases thanh cong va that bai',
          course: 'SWT301',
          priority: 'HIGH',
          status: 'TODO'
        })
      });
      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.title, 'Chuan bi thuyet trinh Postman');
      createdTaskId = data.data.id;
    });

    // 12. Tasks - Update Task (Success)
    await test('PUT /api/tasks/:id - Success returns 200 and updated task', async () => {
      const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'COMPLETED'
        })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.data.status, 'COMPLETED');
    });

    // 13. Tasks - Update Task (Not Found)
    await test('PUT /api/tasks/9999 - Failure (Not Found) returns 404', async () => {
      const res = await fetch(`${baseUrl}/api/tasks/9999`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      assert.strictEqual(res.status, 404);
    });

    // 14. Tasks - Delete Task (Success)
    await test('DELETE /api/tasks/:id - Success returns 200 and deleted info', async () => {
      const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });

    // 15. Tasks - Delete Task (Not Found)
    await test('DELETE /api/tasks/:id - Failure (Not Found) returns 404', async () => {
      const res = await fetch(`${baseUrl}/api/tasks/${createdTaskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      assert.strictEqual(res.status, 404);
    });

  } finally {
    server.close();
  }

  console.log('\n========================================================');
  console.log(`📊 Test Results: Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
