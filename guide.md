# 📚 JS Study Hub — Hướng Dẫn Sử Dụng

> **URL local:** http://localhost:3000
> **Backend API:** http://localhost:3001

---

## Mục Lục

1. [Đăng ký & Đăng nhập](#1-đăng-ký--đăng-nhập)
2. [Dashboard — Tổng quan](#2-dashboard--tổng-quan)
3. [Study Roadmap — Lộ trình học](#3-study-roadmap--lộ-trình-học)
4. [Bài tập (Exercise)](#4-bài-tập-exercise)
5. [Coding Workspace — Chạy code trong trình duyệt](#5-coding-workspace--chạy-code-trong-trình-duyệt)
6. [Checklist học tập](#6-checklist-học-tập)
7. [Attendance — Điểm danh](#7-attendance--điểm-danh)
8. [Study Group — Nhóm học](#8-study-group--nhóm-học)
9. [Activity Feed](#9-activity-feed)
10. [Submissions — Bài nộp](#10-submissions--bài-nộp)
11. [My Profile](#11-my-profile)
12. [Admin Panel](#12-admin-panel)

---

## 1. Đăng ký & Đăng nhập

### Đăng ký tài khoản mới
1. Vào `http://localhost:3000/register`
2. Điền **Tên**, **Email**, **Mật khẩu** (tối thiểu 8 ký tự)
3. Nhấn **"Create Account"**
4. Sau khi đăng ký thành công → tự động chuyển vào Dashboard

### Đăng nhập
1. Vào `http://localhost:3000/login`
2. Điền **Email** và **Mật khẩu**
3. Nhấn **"Sign In"**

### Đăng xuất
- Click vào **avatar / tên** ở góc trên bên phải → chọn **"Logout"**
- Hoặc click **"Log out"** ở cuối sidebar bên trái

> **Tài khoản Admin mặc định (dev):**
> Email: `admin@jsstudyhub.local` | Password: `admin123`

---

## 2. Dashboard — Tổng quan

**URL:** `/dashboard`

Trang chủ sau khi đăng nhập, hiển thị tổng quan tiến độ học tập:

| Thẻ thông tin | Mô tả |
|---------------|-------|
| **Welcome Banner** | Chào mừng + ngày hiện tại |
| **Study Progress** | % hoàn thành lộ trình, số ngày học xong |
| **Today Checklist** | Checklist hôm nay + tiến độ |
| **Today Attendance** | Trạng thái điểm danh hôm nay |
| **Current Study Day** | Study Day đang học hiện tại |
| **Recent Activity** | Hoạt động gần nhất trong nhóm |
| **Quick Stats** | Streak, tổng ngày học, số submissions |

---

## 3. Study Roadmap — Lộ trình học

**URL:** `/roadmap`

Hiển thị toàn bộ lộ trình học theo thứ tự từ Day 1 đến Day N.

### Xem danh sách Study Days
- Mỗi **Study Day card** hiển thị:
  - Số ngày (Day 1, Day 2, ...)
  - Tiêu đề và mô tả ngắn
  - Số bài tập
  - Trạng thái: Locked / In Progress / Completed

### Xem chi tiết một Study Day
1. Click vào Study Day card
2. Trang `/roadmap/[dayId]` hiển thị:
   - Nội dung bài học (content)
   - Danh sách bài tập của ngày đó
   - Checklist học tập

> Nếu Roadmap đang ở trạng thái **DRAFT**, học viên sẽ thấy lỗi 403 — chỉ Admin mới vào được.

---

## 4. Bài tập (Exercise)

**URL:** `/exercises/[exerciseId]`

### Các loại bài tập

| Loại | Mô tả |
|------|-------|
| **Standard Exercise** | Bài tập thông thường — nộp bằng file |
| **Coding Exercise** | Bài tập code trực tiếp trong trình duyệt |

### Nộp bài (Standard Exercise)
1. Click **"Upload File"**
2. Chọn file (ZIP, PDF, JS, TS... — tối đa 10MB, không được upload file .exe)
3. Thêm ghi chú (tùy chọn)
4. Nhấn **"Submit"**
5. Trạng thái bài nộp sẽ là **PENDING** cho đến khi Admin review

---

## 5. Coding Workspace — Chạy code trong trình duyệt

Hiển thị khi bài tập là Coding Exercise.

### Giao diện
- **Monaco Editor** — soạn thảo code JavaScript với syntax highlighting
- **Panel Test Cases** — danh sách test cases cần pass
- **Run Tests** — chạy code trong Web Worker (sandbox)
- **Test Results** — kết quả từng test case

### Cách sử dụng
1. Đọc đề bài và starter code
2. Viết code trong editor
3. Nhấn **"Run Tests"** — code chạy trong sandbox
4. Xem kết quả:
   - **PASS** — output khớp expected
   - **FAIL** — hiển thị expected vs actual
   - **ERROR** — code có lỗi, hiển thị error message
5. Khi tất cả tests PASS → nhấn **"Submit"** để nộp

### Chế độ chạy code

| Mode | Mô tả |
|------|-------|
| **function** | Gọi hàm với args, so sánh return value |
| **console** | So sánh output của console.log() |

> Draft code tự động lưu vào localStorage — reload trang không mất code.

---

## 6. Checklist Học Tập

Mỗi Study Day có một checklist các mục cần hoàn thành.

### Các loại checklist item

| Loại | Cách hoàn thành |
|------|----------------|
| **LESSON** | Tick thủ công sau khi đọc xong |
| **EXERCISE** | Tự động tick khi Admin APPROVE bài nộp |
| **CHECKPOINT** | Tick thủ công |
| **PROJECT** | Tick thủ công |
| **CUSTOM** | Tick thủ công |

> Bạn **không thể** tick thủ công mục EXERCISE — phải nộp bài và được Admin APPROVE.

---

## 7. Attendance — Điểm danh

**URL:** `/attendance`

### Check-in / Check-out
1. Vào trang `/attendance`
2. Nhấn **"Check In"** để bắt đầu học
3. Nhấn **"Check Out"** khi kết thúc → hệ thống tính thời gian học

### Thống kê

| Chỉ số | Mô tả |
|--------|-------|
| **Current Streak** | Số ngày học liên tiếp |
| **Longest Streak** | Streak dài nhất từ trước đến nay |
| **Total Study Days** | Tổng số ngày đã điểm danh |

> Mỗi ngày chỉ được check-in 1 lần. Check-out lần 2 sẽ báo lỗi.

---

## 8. Study Group — Nhóm học

**URL:** `/group`

### Tham gia nhóm
1. Vào `/group`
2. Nhập **Invite Code**
3. Nhấn **"Join Group"**

### Tạo nhóm mới
1. Nhấn **"Create Group"**
2. Đặt tên nhóm → chia sẻ Invite Code cho thành viên

---

## 9. Activity Feed

**URL:** `/activity`

Hiển thị dòng thời gian hoạt động của nhóm:
- Ai đó hoàn thành Study Day
- Ai đó nộp bài tập
- Thành viên mới tham gia

Bộ lọc: **Group Feed** (cả nhóm) | **My Feed** (chỉ bạn)

---

## 10. Submissions — Bài nộp

### Trạng thái bài nộp

| Trạng thái | Ý nghĩa |
|------------|---------|
| **PENDING** | Đang chờ Admin review |
| **APPROVED** | Đã được duyệt, checklist tự tick |
| **REJECTED** | Bị từ chối, xem admin note để biết lý do |

---

## 11. My Profile

**URL:** `/profile`

Cập nhật tên hiển thị và avatar URL.

---

## 12. Admin Panel

> Chỉ dành cho tài khoản có role ADMIN

**URL:** `/admin`

---

### 12.1 Quản lý Study Days

**URL:** `/admin/study-days`

**Tạo Study Day mới:**
1. Nhấn **"+ New Study Day"**
2. Điền Day Number, Title, Description, Content, Display Order
3. Nhấn **"Create"**

**Sắp xếp lại thứ tự (Reorder):**
- Dùng nút up/down hoặc drag-and-drop
- Nhấn **"Save Order"**

> Xoá Study Day sẽ xoá cascade toàn bộ Exercises và Checklist Items.

---

### 12.2 Quản lý Exercises

**URL:** `/admin/exercises`

**Tạo Coding Exercise:**

| Trường | Bắt buộc | Ghi chú |
|--------|----------|---------|
| Language | Có | Chỉ hỗ trợ `javascript` |
| Mode | Có | `function` hoặc `console` |
| Function Name | Có (nếu function mode) | Tên hàm học viên phải viết |
| Starter Code | Khuyến nghị | Code hiển thị sẵn trong editor |
| Test Cases | Có | Ít nhất 1 test case |

**Test case — function mode:**
```
ID:       test-1
Name:     Should return sum of two numbers
Args:     [1, 2]
Expected: 3
```

**Test case — console mode:**
```
ID:             test-1
Name:           Should print hello
Expected Output: Hello, World!
```

---

### 12.3 Quản lý Checklists

**URL:** `/admin/checklists`

- Chọn Study Day → xem và quản lý checklist
- Tạo, sửa, xoá, sắp xếp lại checklist items
- Checklist item type EXERCISE phải liên kết exercise trong cùng Study Day

---

### 12.4 Roadmap Validation & Publishing

**URL:** `/admin/roadmap`

**Quy trình:**
1. Nhấn **"Validate Roadmap"**
2. Xem báo cáo:
   - ERROR — phải sửa trước khi publish
   - WARNING — không bắt buộc sửa
   - INFO — thông tin tham khảo
3. Khi không còn ERROR → nhấn **"Publish"**
4. Học viên truy cập được

**Trạng thái:**
- **PUBLISHED** — học viên vào được bình thường
- **DRAFT** — học viên bị chặn (403)

**Lỗi phổ biến:**

| Lỗi | Cách sửa |
|-----|---------|
| `CODING_NO_TESTS` | Thêm test case cho coding exercise |
| `CODING_FUNCTION_NAME_MISSING` | Điền function name |
| `CHECKLIST_EXERCISE_MISSING` | Liên kết exercise cho checklist item |
| `CHECKLIST_EXERCISE_MISMATCH` | Checklist và exercise phải cùng Study Day |
| `ROADMAP_EMPTY` | Tạo ít nhất 1 Study Day |

---

### 12.5 Review Submissions

**URL:** `/admin/submissions`

1. Xem danh sách bài nộp (mặc định filter PENDING)
2. Click vào submission → tải file về xem
3. Nhấn **"Approve"** hoặc **"Reject"**
4. Thêm admin note (khuyến nghị khi Reject)

Kết quả:
- **APPROVED** → checklist item liên kết tự tick, progress cập nhật
- **REJECTED** → học viên thấy lý do, có thể nộp lại

---

### 12.6 User Management

**URL:** `/admin/users`

Xem danh sách users và đổi role (STUDENT / ADMIN).

---

## Tóm tắt URL

| Trang | URL |
|-------|-----|
| Đăng nhập | `/login` |
| Đăng ký | `/register` |
| Dashboard | `/dashboard` |
| Lộ trình học | `/roadmap` |
| Chi tiết Study Day | `/roadmap/[dayId]` |
| Chi tiết bài tập | `/exercises/[exerciseId]` |
| Điểm danh | `/attendance` |
| Nhóm học | `/group` |
| Activity | `/activity` |
| Profile | `/profile` |
| Admin Overview | `/admin` |
| Quản lý Study Days | `/admin/study-days` |
| Quản lý Exercises | `/admin/exercises` |
| Quản lý Checklists | `/admin/checklists` |
| Roadmap Validation | `/admin/roadmap` |
| Review Submissions | `/admin/submissions` |
| User Management | `/admin/users` |

---

## Luồng học tập điển hình (Student)

```
Đăng nhập
  → Xem Dashboard
  → Check-in điểm danh
  → Vào Roadmap → chọn Study Day
  → Đọc bài học
  → Làm bài tập (code hoặc nộp file)
  → Tick checklist
  → Check-out điểm danh
  → Xem Activity Feed
```

## Luồng Admin điển hình

```
Tạo Study Days
  → Tạo Exercises cho từng ngày
  → Cấu hình Checklist
  → Validate Roadmap → sửa lỗi
  → Publish Roadmap
  → Review Submissions hằng ngày
```

---

*Last updated: 2026-10-02*
