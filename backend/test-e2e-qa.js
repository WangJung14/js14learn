const http = require('http');

const API_BASE = 'http://127.0.0.1:3001/api';

function request(urlPath, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + urlPath);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runQA() {
  console.log('=== STARTING PHASE 4.5 END-TO-END INTEGRATION QA ===\n');
  const results = [];

  const assert = (title, condition, extraInfo = '') => {
    if (condition) {
      console.log(`[PASS] ${title}`);
      results.push({ title, pass: true });
    } else {
      console.error(`[FAIL] ${title} - ${extraInfo}`);
      results.push({ title, pass: false, error: extraInfo });
    }
  };

  try {
    // 1. Health check
    const health = await request('/health');
    assert('1. GET /api/health returns status ok', health.status === 200 && health.data?.status === 'ok');

    // 2. Student Registration
    const regEmail = `student_${Date.now()}@test.com`;
    const regRes = await request('/auth/register', 'POST', {
      name: 'QA Student Test',
      email: regEmail,
      password: 'password123',
    });
    assert('2. POST /api/auth/register creates user & returns tokens', regRes.status === 201 && regRes.data?.tokens?.accessToken);

    // 3. Student Login
    const studentLogin = await request('/auth/login', 'POST', {
      email: 'tommy@jsstudyhub.local',
      password: 'student123',
    });
    assert('3. POST /api/auth/login (Student Tommy)', (studentLogin.status === 200 || studentLogin.status === 201) && studentLogin.data?.tokens?.accessToken);
    const studentToken = studentLogin.data?.tokens?.accessToken;
    const studentRefresh = studentLogin.data?.tokens?.refreshToken;

    // 4. Get Current User /auth/me
    const meRes = await request('/auth/me', 'GET', null, studentToken);
    assert('4. GET /api/auth/me returns Tommy profile', meRes.status === 200 && meRes.data?.email === 'tommy@jsstudyhub.local');

    // 5. Refresh Token /auth/refresh
    const refreshRes = await request('/auth/refresh', 'POST', { refreshToken: studentRefresh });
    assert('5. POST /api/auth/refresh returns new access token', (refreshRes.status === 200 || refreshRes.status === 201) && refreshRes.data?.accessToken);

    // 6. Student Dashboard /dashboard
    const dashRes = await request('/dashboard', 'GET', null, studentToken);
    assert('6. GET /api/dashboard returns user progress & stats', dashRes.status === 200 && dashRes.data?.progress !== undefined);

    // 7. Study Days /study-days
    const daysRes = await request('/study-days', 'GET', null, studentToken);
    assert('7. GET /api/study-days returns study days list', daysRes.status === 200 && Array.isArray(daysRes.data) && daysRes.data.length > 0);
    const firstDay = daysRes.data[0];

    // 8. Study Day Detail /study-days/:id
    const dayDetail = await request(`/study-days/${firstDay.id}`, 'GET', null, studentToken);
    assert('8. GET /api/study-days/:id returns day details with exercises', dayDetail.status === 200 && dayDetail.data?.title);

    // Get exercise ID from Day 1
    const exercisesRes = await request(`/study-days/${firstDay.id}/exercises`, 'GET', null, studentToken);
    assert('9. GET /api/study-days/:id/exercises returns exercises', exercisesRes.status === 200 && Array.isArray(exercisesRes.data) && exercisesRes.data.length > 0);
    const targetExercise = exercisesRes.data[0];

    // 10. Exercise Detail
    const exDetail = await request(`/exercises/${targetExercise.id}`, 'GET', null, studentToken);
    assert('10. GET /api/exercises/:id returns exercise detail', exDetail.status === 200 && exDetail.data?.title);

    // 11. Create Submission
    const subRes = await request('/submissions', 'POST', {
      exerciseId: targetExercise.id,
      fileName: 'solution_day1.js',
      fileUrl: 'https://example.com/solution_day1.js',
      note: 'Automated QA test submission solution',
    }, studentToken);
    assert('11. POST /api/submissions creates submission record (PENDING)', subRes.status === 201 && subRes.data?.status === 'PENDING');
    const submissionId = subRes.data?.id;

    // 12. View Submission Detail /submissions/:id
    const subDetail = await request(`/submissions/${submissionId}`, 'GET', null, studentToken);
    assert('12. GET /api/submissions/:id returns submission detail', subDetail.status === 200 && subDetail.data?.fileName === 'solution_day1.js');

    // 13. View My Submissions /submissions/me
    const mySubmissions = await request('/submissions/me', 'GET', null, studentToken);
    assert('13. GET /api/submissions/me returns list of my submissions', mySubmissions.status === 200 && Array.isArray(mySubmissions.data));

    // 14. Student Route Guard Check (Accessing Admin API endpoint with Student Token -> expect 403)
    const unauthorizedCheck = await request('/admin/submissions', 'GET', null, studentToken);
    assert('14. Student accessing Admin endpoint returns 403 Forbidden', unauthorizedCheck.status === 403);

    // 15. Admin Login
    const adminLogin = await request('/auth/login', 'POST', {
      email: 'admin@jsstudyhub.local',
      password: 'admin123',
    });
    assert('15. POST /api/auth/login (Admin)', (adminLogin.status === 200 || adminLogin.status === 201) && adminLogin.data?.user?.role === 'ADMIN');
    const adminToken = adminLogin.data?.tokens?.accessToken;

    // 16. Admin Get Pending Submissions /admin/submissions?status=PENDING
    const adminPending = await request('/admin/submissions?status=PENDING', 'GET', null, adminToken);
    assert('16. GET /api/admin/submissions returns pending submissions queue', adminPending.status === 200 && Array.isArray(adminPending.data));

    // 17. Admin Review Submission (Approve)
    const reviewRes = await request(`/admin/submissions/${submissionId}/review`, 'PATCH', {
      status: 'APPROVED',
      adminNote: 'Excellent solution! Passed all test cases.',
    }, adminToken);
    assert('17. PATCH /api/admin/submissions/:id/review updates status to APPROVED', reviewRes.status === 200 && reviewRes.data?.status === 'APPROVED');

    // 18. Re-verify Student Progress updates
    const updatedProgress = await request('/progress', 'GET', null, studentToken);
    assert('18. GET /api/progress reflects updated completed exercises', updatedProgress.status === 200 && updatedProgress.data?.percentage !== undefined);

    // 19. Group API /groups/me
    const groupRes = await request('/groups/me', 'GET', null, studentToken);
    assert('19. GET /api/groups/me returns user group', groupRes.status === 200 && groupRes.data?.name);

    // 20. Profile Update /users/me
    const profileUpdate = await request('/users/me', 'PATCH', {
      name: 'Tommy Student (Updated)',
    }, studentToken);
    assert('20. PATCH /api/users/me updates profile name', profileUpdate.status === 200 && profileUpdate.data?.name === 'Tommy Student (Updated)');

    // 21. Admin User Management /users
    const usersList = await request('/users', 'GET', null, adminToken);
    assert('21. GET /api/users (Admin) returns all registered users', usersList.status === 200 && Array.isArray(usersList.data));

    // Summary
    console.log('\n=== INTEGRATION QA SUMMARY ===');
    const passed = results.filter((r) => r.pass).length;
    const failed = results.filter((r) => !r.pass).length;
    console.log(`Total Tests: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error during integration QA:', err);
    process.exit(1);
  }
}

runQA();
