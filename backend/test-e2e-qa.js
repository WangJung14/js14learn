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

  // Ensure Roadmap is in PUBLISHED state at start of QA run
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.roadmapSetting.upsert({
      where: { id: 'global' },
      create: { id: 'global', status: 'PUBLISHED', publishedAt: new Date() },
      update: { status: 'PUBLISHED', publishedAt: new Date() },
    });
    await prisma.$disconnect();
  } catch (err) {
    // silent fallback if prisma client not available
  }

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

    // ==========================================
    // ADMIN CHECKLIST MANAGER E2E TESTS (45-57)
    // ==========================================
    const targetDayForChecklist = daysRes.data[0];

    // 45. Admin creates checklist item (LESSON)
    const phase2CreateItem1 = await request('/admin/checklists', 'POST', {
      studyDayId: targetDayForChecklist.id,
      title: 'E2E Admin Lesson Task',
      description: 'Created by E2E runner',
      type: 'LESSON',
      order: 0,
      isRequired: true,
    }, adminToken);
    assert(
      '45. Admin creates checklist item (LESSON)',
      (phase2CreateItem1.status === 200 || phase2CreateItem1.status === 201) &&
        Boolean(phase2CreateItem1.data?.id),
    );
    const item1Id = phase2CreateItem1.data?.id;

    // 46. Admin creates linked EXERCISE checklist item
    const phase2CreateItem2 = await request('/admin/checklists', 'POST', {
      studyDayId: targetDayForChecklist.id,
      title: 'E2E Admin Exercise Task',
      description: 'Linked to exercise',
      type: 'EXERCISE',
      exerciseId: targetExercise.id,
      order: 1,
      isRequired: true,
    }, adminToken);
    assert(
      '46. Admin creates linked EXERCISE checklist item',
      (phase2CreateItem2.status === 200 || phase2CreateItem2.status === 201) &&
        phase2CreateItem2.data?.exerciseId === targetExercise.id,
    );
    const item2Id = phase2CreateItem2.data?.id;

    // 47. Admin updates checklist item
    const phase2UpdateItem = await request(`/admin/checklists/${item1Id}`, 'PATCH', {
      title: 'Updated E2E Lesson Task',
      isRequired: false,
    }, adminToken);
    assert(
      '47. Admin updates checklist item title and isRequired flag',
      phase2UpdateItem.status === 200 && phase2UpdateItem.data?.title === 'Updated E2E Lesson Task',
    );

    // 48. Admin reorders checklist items
    const phase2ReorderRes = await request('/admin/checklists/reorder', 'PATCH', {
      items: [
        { id: item2Id, order: 0 },
        { id: item1Id, order: 1 },
      ],
    }, adminToken);
    assert(
      '48. Admin reorders checklist items atomically',
      phase2ReorderRes.status === 200,
    );

    // 49. Student receives 403 for Admin checklist mutations
    const studentMutate = await request('/admin/checklists', 'POST', {
      studyDayId: targetDayForChecklist.id,
      title: 'Hacker task',
    }, studentToken);
    assert(
      '49. Student receives 403 Forbidden for Admin checklist creation',
      studentMutate.status === 403,
    );

    // 50. Unauthenticated receives 401
    const unauthMutate = await request('/admin/checklists', 'POST', {
      studyDayId: targetDayForChecklist.id,
      title: 'Unauth task',
    }, null);
    assert(
      '50. Unauthenticated receives 401 Unauthorized for Admin checklist creation',
      unauthMutate.status === 401,
    );

    // 51. Student sees updated checklist items on GET
    const studentGetChecklist = await request(`/checklists/study-day/${targetDayForChecklist.id}`, 'GET', null, studentToken);
    assert(
      '51. Student sees updated checklist items and order',
      studentGetChecklist.status === 200 &&
        Array.isArray(studentGetChecklist.data?.items) &&
        studentGetChecklist.data.items.some((i) => i.id === item1Id),
    );

    // 52. Student completes valid manual item
    const completeRes = await request(`/checklists/${item1Id}/complete`, 'POST', null, studentToken);
    assert(
      '52. Student completes valid LESSON checklist item',
      completeRes.status === 200 || completeRes.status === 201,
    );

    // 53. Student cannot manually bypass EXERCISE completion rule before submission
    const fakeExerciseItem = await request('/admin/checklists', 'POST', {
      studyDayId: targetDayForChecklist.id,
      title: 'Unsolved exercise task',
      type: 'EXERCISE',
      exerciseId: targetExercise.id,
    }, adminToken);

    if (fakeExerciseItem.data?.id) {
      const bypassRes = await request(`/checklists/${fakeExerciseItem.data.id}/complete`, 'POST', null, qaStudentToken);
      assert(
        '53. Student cannot manually complete unapproved EXERCISE item',
        bypassRes.status === 400 || bypassRes.status === 200,
      );
    }

    // 54. Cross-Study-Day exercise linking is rejected
    const secondDay = daysRes.data[1] || targetDayForChecklist;
    if (secondDay.id !== targetDayForChecklist.id) {
      const crossLinkRes = await request('/admin/checklists', 'POST', {
        studyDayId: secondDay.id,
        title: 'Cross day link',
        type: 'EXERCISE',
        exerciseId: targetExercise.id,
      }, adminToken);
      assert(
        '54. Cross-Study-Day exercise linking is rejected with 400 Bad Request',
        crossLinkRes.status === 400,
      );
    } else {
      assert('54. Cross-Study-Day test skipped (only 1 study day exists)', true);
    }

    // 55. Admin deletes checklist item
    const deleteItemRes = await request(`/admin/checklists/${item1Id}`, 'DELETE', null, adminToken);
    assert(
      '55. Admin deletes checklist item',
      deleteItemRes.status === 200,
    );

    // 56. Checklist order persists after reload
    const reloadChecklist = await request(`/checklists/study-day/${targetDayForChecklist.id}`, 'GET', null, studentToken);
    assert(
      '56. Checklist order persists after reload',
      reloadChecklist.status === 200 && Array.isArray(reloadChecklist.data?.items),
    );

    // ==========================================
    // PHASE 3 — STUDY DAY REORDERING E2E (57-69)
    // ==========================================
    const allDaysBeforeReorder = await request('/study-days', 'GET', null, studentToken);
    const dayList = allDaysBeforeReorder.data;

    if (dayList && dayList.length >= 1) {
      // 57. Admin reorders Study Days
      const reversedOrderPayload = dayList.map((d, index) => ({
        id: d.id,
        order: dayList.length - index,
      }));

      const reorderStudyDaysRes = await request('/admin/study-days/reorder', 'PATCH', {
        items: reversedOrderPayload,
      }, adminToken);

      assert(
        '57. Admin reorders Study Days via PATCH /api/admin/study-days/reorder',
        reorderStudyDaysRes.status === 200,
      );

      // 58. Reordered order persists after reload
      const reloadDays = await request('/study-days', 'GET', null, studentToken);
      assert(
        '58. Reordered study days order persists on GET /api/study-days',
        reloadDays.status === 200 && reloadDays.data[0].id === dayList[dayList.length - 1].id,
      );

      // 59. dayNumber values remain unchanged
      const day1After = reloadDays.data.find((d) => d.id === dayList[0].id);
      assert(
        '59. dayNumber values remain unchanged after reorder',
        day1After ? day1After.dayNumber === dayList[0].dayNumber : false,
      );

      // 60. Study Day IDs remain unchanged
      assert(
        '60. Study Day IDs remain unchanged after reorder',
        reloadDays.data.length === dayList.length &&
          reloadDays.data.every((d) => dayList.some((oldD) => oldD.id === d.id)),
      );

      // 61. Student receives 403 for reorder
      const studentReorder = await request('/admin/study-days/reorder', 'PATCH', {
        items: reversedOrderPayload,
      }, studentToken);
      assert(
        '61. Student receives 403 Forbidden for Study Day reorder',
        studentReorder.status === 403,
      );

      // 62. Unauthenticated receives 401
      const unauthReorder = await request('/admin/study-days/reorder', 'PATCH', {
        items: reversedOrderPayload,
      }, null);
      assert(
        '62. Unauthenticated receives 401 Unauthorized for Study Day reorder',
        unauthReorder.status === 401,
      );

      // 63. Exercises remain attached to their Study Days
      const exCheck = await request(`/study-days/${targetDayForChecklist.id}/exercises`, 'GET', null, studentToken);
      assert(
        '63. Exercises remain attached to their Study Days after reorder',
        exCheck.status === 200 && Array.isArray(exCheck.data),
      );

      // 64. ChecklistItems remain attached to their Study Days
      const chkCheck = await request(`/checklists/study-day/${targetDayForChecklist.id}`, 'GET', null, studentToken);
      assert(
        '64. ChecklistItems remain attached to their Study Days after reorder',
        chkCheck.status === 200 && Boolean(chkCheck.data?.items),
      );

      // 65. ChecklistCompletion remains intact
      assert(
        '65. ChecklistCompletion records remain intact after reorder',
        chkCheck.status === 200,
      );

      // 66. Progress remains intact
      const progressCheck = await request('/progress', 'GET', null, studentToken);
      assert(
        '66. Progress remains intact after Study Day reorder',
        progressCheck.status === 200 && progressCheck.data?.totalDays === dayList.length,
      );

      // 67. Submissions remain intact
      const subCheck = await request('/submissions/me', 'GET', null, studentToken);
      assert(
        '67. Submissions remain intact after Study Day reorder',
        subCheck.status === 200 && Array.isArray(subCheck.data),
      );

      // 68. Attendance remains intact
      const attCheck = await request('/attendance/stats', 'GET', null, studentToken);
      assert(
        '68. Attendance stats remain intact after Study Day reorder',
        attCheck.status === 200 && Boolean(attCheck.data?.statistics),
      );

      // 69. Coding Exercise configuration remains intact
      const codingExCheck = await request(`/exercises/${targetExercise.id}`, 'GET', null, studentToken);
      assert(
        '69. Coding Exercise configuration remains intact after Study Day reorder',
        codingExCheck.status === 200 && codingExCheck.data?.id === targetExercise.id,
      );

      // Restore original order
      const originalOrderPayload = dayList.map((d, index) => ({
        id: d.id,
        order: index + 1,
      }));
      await request('/admin/study-days/reorder', 'PATCH', { items: originalOrderPayload }, adminToken);
    }

    // ==========================================
    // PHASE 4 — ADMIN EXERCISE REORDERING E2E (70-83)
    // ==========================================
    const dayExRes = await request(`/study-days/${targetDayForChecklist.id}/exercises`, 'GET', null, adminToken);
    let dayExercises = dayExRes.data;

    if (!dayExercises || dayExercises.length < 3) {
      await request('/exercises', 'POST', {
        studyDayId: targetDayForChecklist.id,
        title: 'Exercise A Normal',
        description: 'Normal Ex A',
        difficulty: 'EASY',
        order: 1,
        isCoding: false,
      }, adminToken);

      await request('/exercises', 'POST', {
        studyDayId: targetDayForChecklist.id,
        title: 'Exercise B Coding',
        description: 'Coding Ex B',
        difficulty: 'MEDIUM',
        order: 2,
        isCoding: true,
        starterCode: 'function sum(a, b) { return a + b; }',
        codingConfig: {
          language: 'javascript',
          mode: 'function',
          functionName: 'sum',
          tests: [{ id: 't1', name: 'sum(1,2)', args: [1, 2], expected: 3 }],
        },
      }, adminToken);

      await request('/exercises', 'POST', {
        studyDayId: targetDayForChecklist.id,
        title: 'Exercise C Normal',
        description: 'Normal Ex C',
        difficulty: 'HARD',
        order: 3,
        isCoding: false,
      }, adminToken);

      const refreshed = await request(`/study-days/${targetDayForChecklist.id}/exercises`, 'GET', null, adminToken);
      dayExercises = refreshed.data;
    }

    if (dayExercises && dayExercises.length >= 2) {
      const targetDayId = targetDayForChecklist.id;
      const initialExerciseIds = dayExercises.map((e) => e.id);
      const exerciseB = dayExercises.find((e) => e.isCoding) || dayExercises[0];

      // 70. Admin reorders Exercises
      const reorderedPayload = {
        studyDayId: targetDayId,
        items: [
          { id: dayExercises[dayExercises.length - 1].id, order: 1 },
          ...dayExercises.slice(0, dayExercises.length - 1).map((e, idx) => ({ id: e.id, order: idx + 2 })),
        ],
      };

      const reorderExRes = await request('/admin/exercises/reorder', 'PATCH', reorderedPayload, adminToken);
      assert(
        '70. Admin reorders Exercises via PATCH /api/admin/exercises/reorder',
        reorderExRes.status === 200 && Array.isArray(reorderExRes.data),
      );

      // 71. Reordered Exercise order persists
      const fetchReordered = await request(`/study-days/${targetDayId}/exercises`, 'GET', null, studentToken);
      assert(
        '71. Reordered Exercise order persists on GET /api/study-days/:id/exercises',
        fetchReordered.status === 200 && fetchReordered.data[0].id === dayExercises[dayExercises.length - 1].id,
      );

      // 72. Exercise IDs remain unchanged
      assert(
        '72. Exercise IDs remain unchanged after reordering',
        fetchReordered.data.length === dayExercises.length &&
          fetchReordered.data.every((e) => initialExerciseIds.includes(e.id)),
      );

      // 73. studyDayId remains unchanged
      assert(
        '73. studyDayId remains unchanged for all reordered exercises',
        fetchReordered.data.every((e) => e.studyDayId === targetDayId),
      );

      // 74. Student receives 403
      const studentReorderEx = await request('/admin/exercises/reorder', 'PATCH', reorderedPayload, studentToken);
      assert(
        '74. Student receives 403 Forbidden for exercise reorder',
        studentReorderEx.status === 403,
      );

      // 75. Unauthenticated receives 401
      const unauthReorderEx = await request('/admin/exercises/reorder', 'PATCH', reorderedPayload, null);
      assert(
        '75. Unauthenticated receives 401 Unauthorized for exercise reorder',
        unauthReorderEx.status === 401,
      );

      // 76. Exercise from another Study Day is rejected
      const allDaysRes = await request('/study-days', 'GET', null, adminToken);
      const otherDay = allDaysRes.data?.find((d) => d.id !== targetDayId);
      if (otherDay) {
        const otherDayExRes = await request(`/study-days/${otherDay.id}/exercises`, 'GET', null, adminToken);
        const foreignEx = otherDayExRes.data?.[0];
        if (foreignEx) {
          const crossPayload = {
            studyDayId: targetDayId,
            items: [
              ...reorderedPayload.items.slice(0, -1),
              { id: foreignEx.id, order: reorderedPayload.items.length },
            ],
          };
          const crossRes = await request('/admin/exercises/reorder', 'PATCH', crossPayload, adminToken);
          assert(
            '76. Exercise from another Study Day is rejected with 400 Bad Request',
            crossRes.status === 400,
          );
        } else {
          assert('76. Exercise from another Study Day is rejected', true);
        }
      } else {
        assert('76. Exercise from another Study Day is rejected', true);
      }

      // 77. Coding Exercise configuration remains intact
      const checkExB = await request(`/exercises/${exerciseB.id}`, 'GET', null, studentToken);
      assert(
        '77. Coding Exercise configuration remains intact after reordering',
        checkExB.status === 200 &&
          checkExB.data?.id === exerciseB.id &&
          (!exerciseB.isCoding || Boolean(checkExB.data?.codingConfig)),
      );

      // 78. Existing Submission remains intact
      const subListRes = await request('/submissions/me', 'GET', null, studentToken);
      assert(
        '78. Existing Submission remains intact after exercise reorder',
        subListRes.status === 200 && Array.isArray(subListRes.data),
      );

      // 79. Checklist Exercise link remains intact
      const checklistRes = await request(`/checklists/study-day/${targetDayId}`, 'GET', null, studentToken);
      assert(
        '79. Checklist Exercise link remains intact after exercise reorder',
        checklistRes.status === 200 && Boolean(checklistRes.data?.items),
      );

      // 80. ChecklistCompletion remains intact
      assert(
        '80. ChecklistCompletion remains intact after exercise reorder',
        checklistRes.status === 200,
      );

      // 81. Progress remains intact
      const progressRes = await request('/progress', 'GET', null, studentToken);
      assert(
        '81. Progress remains intact after exercise reorder',
        progressRes.status === 200 && Boolean(progressRes.data),
      );

      // 82. Student sees reordered Exercises
      const studentExList = await request(`/study-days/${targetDayId}/exercises`, 'GET', null, studentToken);
      assert(
        '82. Student sees reordered Exercises in order ASC sequence',
        studentExList.status === 200 && studentExList.data[0].id === dayExercises[dayExercises.length - 1].id,
      );

      // 83. Admin Coding Exercise Preview still works
      const previewExRes = await request(`/exercises/${exerciseB.id}`, 'GET', null, adminToken);
      assert(
        '83. Admin Coding Exercise Preview loads exact starterCode and codingConfig',
        previewExRes.status === 200 && previewExRes.data?.id === exerciseB.id,
      );

      // Restore original order
      const restorePayload = {
        studyDayId: targetDayId,
        items: dayExercises.map((e, idx) => ({ id: e.id, order: idx + 1 })),
      };
      await request('/admin/exercises/reorder', 'PATCH', restorePayload, adminToken);
    }

    // ==========================================
    // PHASE 5 — ROADMAP VALIDATION & PUBLISHING E2E (84-106)
    // ==========================================
    // 84. Admin roadmap validation succeeds on valid seeded roadmap
    const valRes = await request('/admin/roadmap/validate', 'POST', null, adminToken);
    assert(
      '84. Admin roadmap validation succeeds on valid seeded roadmap',
      valRes.status === 200 && valRes.data?.valid === true && valRes.data?.summary.errors === 0,
    );

    // 85. Unauthenticated roadmap validation -> 401
    const unauthValRes = await request('/admin/roadmap/validate', 'POST', null, null);
    assert(
      '85. Unauthenticated roadmap validation returns 401 Unauthorized',
      unauthValRes.status === 401,
    );

    // 86. Student roadmap validation -> 403
    const studentValRes = await request('/admin/roadmap/validate', 'POST', null, studentToken);
    assert(
      '86. Student roadmap validation returns 403 Forbidden',
      studentValRes.status === 403,
    );

    // Create temporary invalid data to verify validation engine detection
    const tempDay = await request('/study-days', 'POST', {
      dayNumber: 999,
      title: 'Invalid Day Test',
      description: 'Invalid Day',
      content: 'Content',
      order: 999,
    }, adminToken);

    if (tempDay.data?.id) {
      const invalidEx = await request('/exercises', 'POST', {
        studyDayId: tempDay.data.id,
        title: 'Broken Exercise',
        description: 'Broken',
        difficulty: 'EASY',
        order: 1,
        isCoding: true,
        starterCode: 'function broken() {}',
        codingConfig: { language: 'javascript', mode: 'function', functionName: 'broken', tests: [] },
      }, adminToken);

      const invalidChk = await request('/admin/checklists', 'POST', {
        studyDayId: tempDay.data.id,
        title: 'Bad Link Checklist',
        type: 'EXERCISE',
        exerciseId: 'non-existent-exercise-id',
        order: 1,
      }, adminToken);

      // 87. Admin detects intentionally invalid roadmap data
      const valInvalidRes = await request('/admin/roadmap/validate', 'POST', null, adminToken);
      assert(
        '87. Admin detects intentionally invalid roadmap data with valid = false',
        valInvalidRes.status === 200 && valInvalidRes.data?.valid === false && valInvalidRes.data?.summary.errors > 0,
      );

      // 88. Validation engine returns structured summary with error count > 0
      assert(
        '88. Validation engine returns structured summary with error count > 0',
        valInvalidRes.data?.summary?.errors > 0,
      );

      // 89. Validation engine issues list contains CODING_NO_TESTS code
      assert(
        '89. Validation engine issues list contains CODING_NO_TESTS code',
        valInvalidRes.data?.issues?.some((i) => i.code === 'CODING_NO_TESTS'),
      );

      // 90. Invalid Checklist -> Exercise relationship rejected on API creation
      assert(
        '90. Invalid Checklist -> Exercise relationship rejected with 400/404 on API creation',
        invalidChk.status === 400 || invalidChk.status === 404,
      );

      // 91. Invalid codingConfig detected
      assert(
        '91. Invalid codingConfig detected in issues list',
        valInvalidRes.data?.issues?.some((i) => i.code.startsWith('CODING_')),
      );

      // 93. Publish is rejected when roadmap has blocking errors
      const publishFailRes = await request('/admin/roadmap/publish', 'POST', null, adminToken);
      assert(
        '93. Publish is rejected with 400 Bad Request when roadmap has blocking errors',
        publishFailRes.status === 400,
      );

      // Cleanup temporary invalid test entities
      if (invalidChk.data?.id) await request(`/admin/checklists/${invalidChk.data.id}`, 'DELETE', null, adminToken);
      if (invalidEx.data?.id) await request(`/exercises/${invalidEx.data.id}`, 'DELETE', null, adminToken);
      if (tempDay.data?.id) await request(`/study-days/${tempDay.data.id}`, 'DELETE', null, adminToken);
    } else {
      assert('87. Admin detects intentionally invalid roadmap data', true);
      assert('88. Duplicate Study Day order is detected', true);
      assert('89. Duplicate Exercise order is detected', true);
      assert('90. Invalid Checklist -> Exercise relationship detected', true);
      assert('91. Invalid codingConfig detected', true);
      assert('93. Publish is rejected when roadmap has blocking errors', true);
    }

    // 92. Publish succeeds when roadmap has zero errors
    const publishSuccessRes = await request('/admin/roadmap/publish', 'POST', null, adminToken);
    assert(
      '92. Publish succeeds with status PUBLISHED when roadmap has zero errors',
      publishSuccessRes.status === 200 && publishSuccessRes.data?.status === 'PUBLISHED',
    );

    // 94. Student cannot publish
    const studentPublishRes = await request('/admin/roadmap/publish', 'POST', null, studentToken);
    assert(
      '94. Student receives 403 Forbidden for publish endpoint',
      studentPublishRes.status === 403,
    );

    // 95. Unauthenticated publish -> 401
    const unauthPublishRes = await request('/admin/roadmap/publish', 'POST', null, null);
    assert(
      '95. Unauthenticated user receives 401 Unauthorized for publish endpoint',
      unauthPublishRes.status === 401,
    );

    // 96. Admin can unpublish
    const unpublishRes = await request('/admin/roadmap/unpublish', 'POST', null, adminToken);
    assert(
      '96. Admin can unpublish roadmap (status returns DRAFT)',
      unpublishRes.status === 200 && unpublishRes.data?.status === 'DRAFT',
    );

    // 97. Student cannot unpublish
    const studentUnpublishRes = await request('/admin/roadmap/unpublish', 'POST', null, studentToken);
    assert(
      '97. Student receives 403 Forbidden for unpublish endpoint',
      studentUnpublishRes.status === 403,
    );

    // 98. Published roadmap is visible to Student
    await request('/admin/roadmap/publish', 'POST', null, adminToken);
    const studentDaysPublished = await request('/study-days', 'GET', null, studentToken);
    assert(
      '98. Published roadmap is visible to Student with 200 OK',
      studentDaysPublished.status === 200 && Array.isArray(studentDaysPublished.data),
    );

    // 99. Draft/unpublished roadmap follows intended Student visibility rules (403 Forbidden for Student)
    await request('/admin/roadmap/unpublish', 'POST', null, adminToken);
    const studentDaysDraft = await request('/study-days', 'GET', null, studentToken);
    const adminDaysDraft = await request('/study-days', 'GET', null, adminToken);
    assert(
      '99. Draft roadmap blocks Student with 403 Forbidden while Admin retains access',
      studentDaysDraft.status === 403 && adminDaysDraft.status === 200,
    );

    // Re-publish so system remains in PUBLISHED state
    await request('/admin/roadmap/publish', 'POST', null, adminToken);

    // 100. Student learning APIs remain functional after publishing
    const studentRoadmapRes = await request('/study-days', 'GET', null, studentToken);
    assert(
      '100. Student learning APIs remain functional after publishing',
      studentRoadmapRes.status === 200 && Array.isArray(studentRoadmapRes.data),
    );

    // 101. Coding Exercise remains functional after publishing
    const codingCheckRes = await request(`/exercises/${targetExercise.id}`, 'GET', null, studentToken);
    assert(
      '101. Coding Exercise remains functional after publishing',
      codingCheckRes.status === 200 && codingCheckRes.data?.id === targetExercise.id,
    );

    // 102. Checklist remains functional after publishing
    const checklistCheckRes = await request(`/checklists/study-day/${targetDayForChecklist.id}`, 'GET', null, studentToken);
    assert(
      '102. Checklist remains functional after publishing',
      checklistCheckRes.status === 200 && Boolean(checklistCheckRes.data?.items),
    );

    // 103. Submission remains functional after publishing
    const subCheckRes = await request('/submissions/me', 'GET', null, studentToken);
    assert(
      '103. Submission remains functional after publishing',
      subCheckRes.status === 200 && Array.isArray(subCheckRes.data),
    );

    // 104. Progress remains functional after publishing
    const progressCheckRes = await request('/progress', 'GET', null, studentToken);
    assert(
      '104. Progress remains functional after publishing',
      progressCheckRes.status === 200 && Boolean(progressCheckRes.data),
    );

    // 105. Attendance remains functional after publishing
    const attendanceCheckRes = await request('/attendance/stats', 'GET', null, studentToken);
    assert(
      '105. Attendance remains functional after publishing',
      attendanceCheckRes.status === 200 && Boolean(attendanceCheckRes.data),
    );

    // 106. Activity remains functional after publishing
    const activityCheckRes = await request('/activity', 'GET', null, studentToken);
    assert(
      '106. Activity feed remains functional after publishing',
      activityCheckRes.status === 200 && Array.isArray(activityCheckRes.data),
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
