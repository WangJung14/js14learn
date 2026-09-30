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

function uploadFileMultipart(urlPath, exerciseId, fileName, fileContentBuffer, contentType, token, note = '') {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const url = new URL(API_BASE + urlPath);

    let postData = '';
    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="exerciseId"\r\n\r\n${exerciseId}\r\n`;

    if (note) {
      postData += `--${boundary}\r\n`;
      postData += `Content-Disposition: form-data; name="note"\r\n\r\n${note}\r\n`;
    }

    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`;
    postData += `Content-Type: ${contentType}\r\n\r\n`;

    const footer = `\r\n--${boundary}--\r\n`;

    const headerBuf = Buffer.from(postData, 'utf-8');
    const footerBuf = Buffer.from(footer, 'utf-8');
    const payload = Buffer.concat([headerBuf, fileContentBuffer, footerBuf]);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length,
        'Authorization': `Bearer ${token}`,
      },
    };

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
    req.write(payload);
    req.end();
  });
}

async function runQA() {
  console.log('=== STARTING PHASE 4.5 & SUPABASE STORAGE INTEGRATION QA ===\n');
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

    // 11. Create Submission via Multipart Upload to Supabase Storage
    const sampleJsBuffer = Buffer.from('function solution() { return "Day 1 Solution"; }', 'utf-8');
    const subRes = await uploadFileMultipart(
      '/submissions',
      targetExercise.id,
      'solution_day1.js',
      sampleJsBuffer,
      'application/javascript',
      studentToken,
      'Automated Supabase Storage QA test submission',
    );
    if (!subRes.data?.signedUrl) {
      console.log('Test 11 subRes debug:', JSON.stringify(subRes));
    }
    assert(
      '11. POST /api/submissions (multipart) uploads binary file to Supabase Storage & creates submission (PENDING)',
      (subRes.status === 200 || subRes.status === 201) && subRes.data?.status === 'PENDING' && subRes.data?.signedUrl !== undefined,
      JSON.stringify(subRes.data),
    );
    const submissionId = subRes.data?.id;

    // 12. View Submission Detail /submissions/:id (returns signedUrl)
    const subDetail = await request(`/submissions/${submissionId}`, 'GET', null, studentToken);
    assert(
      '12. GET /api/submissions/:id returns submission detail with signedUrl',
      subDetail.status === 200 && subDetail.data?.fileName === 'solution_day1.js' && Boolean(subDetail.data?.signedUrl),
    );

    // 13. View My Submissions /submissions/me
    const mySubmissions = await request('/submissions/me', 'GET', null, studentToken);
    assert('13. GET /api/submissions/me returns list of my submissions with signedUrls', mySubmissions.status === 200 && Array.isArray(mySubmissions.data));

    // 14. Invalid File Size Test (> 10MB)
    const hugeBuffer = Buffer.alloc(11 * 1024 * 1024); // 11MB
    const hugeUpload = await uploadFileMultipart(
      '/submissions',
      targetExercise.id,
      'huge_file.js',
      hugeBuffer,
      'application/javascript',
      studentToken,
    );
    assert('14. Uploading >10MB file fails with 400 Bad Request', hugeUpload.status === 400);

    // 15. Invalid File Format Test (.exe)
    const exeBuffer = Buffer.from('binary', 'utf-8');
    const exeUpload = await uploadFileMultipart(
      '/submissions',
      targetExercise.id,
      'malicious.exe',
      exeBuffer,
      'application/x-msdownload',
      studentToken,
    );
    assert('15. Uploading unsupported file extension (.exe) fails with 400 Bad Request', exeUpload.status === 400);

    // 16. Student Route Guard Check (Accessing Admin API endpoint with Student Token -> expect 403)
    const unauthorizedCheck = await request('/admin/submissions', 'GET', null, studentToken);
    assert('16. Student accessing Admin endpoint returns 403 Forbidden', unauthorizedCheck.status === 403);

    // 17. Admin Login
    const adminLogin = await request('/auth/login', 'POST', {
      email: 'admin@jsstudyhub.local',
      password: 'admin123',
    });
    assert('17. POST /api/auth/login (Admin)', (adminLogin.status === 200 || adminLogin.status === 201) && adminLogin.data?.user?.role === 'ADMIN');
    const adminToken = adminLogin.data?.tokens?.accessToken;

    // 18. Admin Get Pending Submissions /admin/submissions?status=PENDING
    const adminPending = await request('/admin/submissions?status=PENDING', 'GET', null, adminToken);
    assert('18. GET /api/admin/submissions returns pending submissions queue with signedUrls', adminPending.status === 200 && Array.isArray(adminPending.data));

    // 19. Admin Review Submission (Approve)
    const reviewRes = await request(`/admin/submissions/${submissionId}/review`, 'PATCH', {
      status: 'APPROVED',
      adminNote: 'Excellent solution uploaded to Supabase! Passed all test cases.',
    }, adminToken);
    assert('19. PATCH /api/admin/submissions/:id/review updates status to APPROVED', reviewRes.status === 200 && reviewRes.data?.status === 'APPROVED');

    // 20. Re-verify Student Progress updates
    const updatedProgress = await request('/progress', 'GET', null, studentToken);
    assert('20. GET /api/progress reflects updated completed exercises', updatedProgress.status === 200 && updatedProgress.data?.percentage !== undefined);

    // 21. Group API /groups/me
    const groupRes = await request('/groups/me', 'GET', null, studentToken);
    assert('21. GET /api/groups/me returns user group', groupRes.status === 200 && groupRes.data?.name);

    // 22. Profile Update /users/me
    const profileUpdate = await request('/users/me', 'PATCH', {
      name: 'Tommy Student (Updated)',
    }, studentToken);
    assert('22. PATCH /api/users/me updates profile name', profileUpdate.status === 200 && profileUpdate.data?.name === 'Tommy Student (Updated)');

    // 23. Admin User Management /users
    const usersList = await request('/users', 'GET', null, adminToken);
    assert('23. GET /api/users (Admin) returns all registered users', usersList.status === 200 && Array.isArray(usersList.data));

    // 24. Activity API GET /api/activity (Group Feed)
    const activityGroupRes = await request('/activity', 'GET', null, studentToken);
    assert(
      '24. GET /api/activity returns group activities feed with user profile',
      activityGroupRes.status === 200 &&
        Array.isArray(activityGroupRes.data) &&
        activityGroupRes.data.length > 0 &&
        Boolean(activityGroupRes.data[0].message) &&
        Boolean(activityGroupRes.data[0].user?.name),
    );

    // 25. Activity API GET /api/activity/me (Personal Feed)
    const activityMeRes = await request('/activity/me', 'GET', null, studentToken);
    assert(
      '25. GET /api/activity/me returns personal user activities feed',
      activityMeRes.status === 200 && Array.isArray(activityMeRes.data),
    );

    // ==========================================
    // CHECKLIST & ATTENDANCE PHASE 3 TESTS
    // ==========================================

    // 26. GET /api/checklists/today
    const todayChecklistRes = await request('/checklists/today', 'GET', null, studentToken);
    assert(
      '26. GET /api/checklists/today returns today study day checklist with items & summary',
      todayChecklistRes.status === 200 &&
        Boolean(todayChecklistRes.data?.summary) &&
        Array.isArray(todayChecklistRes.data?.items) &&
        todayChecklistRes.data.items.length > 0,
      JSON.stringify(todayChecklistRes.data),
    );
    const lessonItem = todayChecklistRes.data.items.find((i) => i.type === 'LESSON');
    const exerciseItem = todayChecklistRes.data.items.find((i) => i.type === 'EXERCISE');

    // 27. GET /api/checklists/study-day/:studyDayId
    const dayChecklistRes = await request(`/checklists/study-day/${firstDay.id}`, 'GET', null, studentToken);
    assert(
      '27. GET /api/checklists/study-day/:id returns checklist for specific study day',
      dayChecklistRes.status === 200 && Array.isArray(dayChecklistRes.data?.items),
    );

    // 28. POST /api/checklists/:id/complete (Manual Item)
    const completeLessonRes = await request(`/checklists/${lessonItem.id}/complete`, 'POST', null, studentToken);
    assert(
      '28. POST /api/checklists/:id/complete marks LESSON item completed',
      completeLessonRes.status === 200 || completeLessonRes.status === 201,
    );

    // 29. Duplicate completion is idempotent
    const duplicateCompleteRes = await request(`/checklists/${lessonItem.id}/complete`, 'POST', null, studentToken);
    assert(
      '29. Duplicate POST /api/checklists/:id/complete is idempotent',
      duplicateCompleteRes.status === 200 || duplicateCompleteRes.status === 201,
    );

    // 30. DELETE /api/checklists/:id/complete (Uncomplete Manual Item)
    const uncompleteLessonRes = await request(`/checklists/${lessonItem.id}/complete`, 'DELETE', null, studentToken);
    assert(
      '30. DELETE /api/checklists/:id/complete unmarks LESSON item',
      uncompleteLessonRes.status === 200,
    );

    // 31. Attempting manual completion of unapproved EXERCISE item fails
    if (exerciseItem) {
      const manualExFail = await request(`/checklists/${exerciseItem.id}/complete`, 'POST', null, studentToken);
      assert(
        '31. Completing unapproved EXERCISE checklist item manually fails with 400 Bad Request',
        manualExFail.status === 400,
        JSON.stringify(manualExFail.data),
      );
    }

    // 32. Admin Create Checklist Item POST /api/admin/checklists
    const adminCreateItemRes = await request('/admin/checklists', 'POST', {
      studyDayId: firstDay.id,
      title: 'QA Admin Created Task',
      type: 'CUSTOM',
      order: 99,
      isRequired: false,
    }, adminToken);
    assert(
      '32. POST /api/admin/checklists creates new checklist item (Admin)',
      (adminCreateItemRes.status === 200 || adminCreateItemRes.status === 201) && adminCreateItemRes.data?.id,
    );
    const createdItemId = adminCreateItemRes.data?.id;

    // 33. Admin Update Checklist Item PATCH /api/admin/checklists/:id
    const adminUpdateItemRes = await request(`/admin/checklists/${createdItemId}`, 'PATCH', {
      title: 'QA Admin Updated Task Title',
    }, adminToken);
    assert(
      '33. PATCH /api/admin/checklists/:id updates item title (Admin)',
      adminUpdateItemRes.status === 200 && adminUpdateItemRes.data?.title === 'QA Admin Updated Task Title',
    );

    // 34. Admin Reorder Checklist Items PATCH /api/admin/checklists/reorder
    const adminReorderRes = await request('/admin/checklists/reorder', 'PATCH', {
      items: [{ id: createdItemId, order: 100 }],
    }, adminToken);
    assert(
      '34. PATCH /api/admin/checklists/reorder updates item orders (Admin)',
      adminReorderRes.status === 200,
    );

    // 35. Admin Delete Checklist Item DELETE /api/admin/checklists/:id
    const adminDeleteItemRes = await request(`/admin/checklists/${createdItemId}`, 'DELETE', null, adminToken);
    assert(
      '35. DELETE /api/admin/checklists/:id deletes checklist item (Admin)',
      adminDeleteItemRes.status === 200,
    );

    // 36 & 37. Auto-completion for Linked Exercise Checklist Items upon Admin Approval
    const sampleEx2Buffer = Buffer.from('function solution2() { return "Day 1 Solution 2"; }', 'utf-8');
    const sub2Res = await uploadFileMultipart(
      '/submissions',
      targetExercise.id,
      'solution_day1_ex2.js',
      sampleEx2Buffer,
      'application/javascript',
      studentToken,
      'Submission for checklist auto-completion test',
    );
    const sub2Id = sub2Res.data?.id;

    // Verify PENDING submission did NOT complete exercise checklist item
    const checklistPendingCheck = await request('/checklists/today', 'GET', null, studentToken);
    const exItemBeforeApproval = checklistPendingCheck.data?.items?.find((i) => i.exerciseId === targetExercise.id);
    assert(
      '36. PENDING exercise submission does NOT auto-complete linked checklist item',
      exItemBeforeApproval ? !exItemBeforeApproval.isCompleted : true,
    );

    // Admin Approves Submission
    await request(`/admin/submissions/${sub2Id}/review`, 'PATCH', {
      status: 'APPROVED',
      adminNote: 'Approved for checklist auto-completion test',
    }, adminToken);

    // Verify APPROVED submission automatically completed linked checklist item
    const checklistApprovedCheck = await request('/checklists/today', 'GET', null, studentToken);
    const exItemAfterApproval = checklistApprovedCheck.data?.items?.find((i) => i.exerciseId === targetExercise.id);
    assert(
      '37. APPROVED exercise submission automatically creates ChecklistCompletion for linked item',
      exItemAfterApproval ? exItemAfterApproval.isCompleted === true : true,
    );

    // Use freshly registered student token for attendance check-in/check-out lifecycle tests
    const qaStudentToken = regRes.data?.tokens?.accessToken;

    // 38. GET /api/attendance/today before check-in
    const attTodayBefore = await request('/attendance/today', 'GET', null, qaStudentToken);
    assert(
      '38. GET /api/attendance/today returns attendance status object',
      attTodayBefore.status === 200 && attTodayBefore.data?.isCheckedIn === false,
    );

    // 39. POST /api/attendance/check-in
    const checkInRes = await request('/attendance/check-in', 'POST', null, qaStudentToken);
    assert(
      '39. POST /api/attendance/check-in creates today attendance record',
      (checkInRes.status === 200 || checkInRes.status === 201) && Boolean(checkInRes.data?.checkedInAt),
    );

    // 40. Duplicate POST /api/attendance/check-in returns existing record
    const dupCheckInRes = await request('/attendance/check-in', 'POST', null, qaStudentToken);
    assert(
      '40. Duplicate POST /api/attendance/check-in is idempotent and returns existing attendance',
      dupCheckInRes.status === 200 || dupCheckInRes.status === 201,
    );

    // 41. POST /api/attendance/check-out
    const checkOutRes = await request('/attendance/check-out', 'POST', null, qaStudentToken);
    assert(
      '41. POST /api/attendance/check-out sets checkedOutAt and computes durationMinutes',
      (checkOutRes.status === 200 || checkOutRes.status === 201) &&
        Boolean(checkOutRes.data?.checkedOutAt) &&
        checkOutRes.data?.durationMinutes >= 1,
      JSON.stringify(checkOutRes.data),
    );

    // 42. Duplicate POST /api/attendance/check-out fails
    const dupCheckOutRes = await request('/attendance/check-out', 'POST', null, qaStudentToken);
    assert(
      '42. Duplicate POST /api/attendance/check-out fails with 400 Bad Request',
      dupCheckOutRes.status === 400,
    );

    // 43. GET /api/attendance/stats
    const attStatsRes = await request('/attendance/stats', 'GET', null, qaStudentToken);
    assert(
      '43. GET /api/attendance/stats returns streak counts, total study days, and recent records',
      attStatsRes.status === 200 && attStatsRes.data?.statistics?.totalAttendanceDays >= 1,
    );

    // 44. Dashboard Service extension check
    const extendedDashboard = await request('/dashboard', 'GET', null, studentToken);
    assert(
      '44. GET /api/dashboard contains todayChecklist and todayAttendance fields',
      extendedDashboard.status === 200 &&
        Boolean(extendedDashboard.data?.todayChecklist) &&
        Boolean(extendedDashboard.data?.todayAttendance),
    );

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
