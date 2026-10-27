/**
 * Mock in-memory database for Student Task Manager
 */

const mockUsers = [
  {
    id: 1,
    username: "student",
    password: "password123",
    fullName: "Nguyen Van A",
    email: "student@fpt.edu.vn",
    role: "student"
  }
];

const mockTasks = [
  {
    id: 1,
    title: "On tap ly thuyet SWT301",
    description: "Hoc lai cac ky thuat kiem thu hop den (Black-box testing) va hop trang (White-box testing)",
    course: "SWT301",
    dueDate: "2026-10-20",
    priority: "HIGH",
    status: "TODO",
    createdAt: "2026-10-15T08:00:00.000Z"
  },
  {
    id: 2,
    title: "Cai dat Postman va Newman",
    description: "Chuan bi moi truong de kiem thu API tu dong",
    course: "SWT301",
    dueDate: "2026-10-22",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    createdAt: "2026-10-16T09:30:00.000Z"
  },
  {
    id: 3,
    title: "Lam bai tap Assignment 1",
    description: "Viet test case va tao Postman Collection cho he thong quan ly nhiem vu sinh vien",
    course: "SWT301",
    dueDate: "2026-10-25",
    priority: "HIGH",
    status: "COMPLETED",
    createdAt: "2026-10-16T14:00:00.000Z"
  }
];

// In-memory working copy
let tasks = [...mockTasks];
let nextTaskId = 4;

const VALID_TOKEN = "mock-token-swt301-xyz123";

const resetData = () => {
  tasks = JSON.parse(JSON.stringify(mockTasks));
  nextTaskId = 4;
};

module.exports = {
  mockUsers,
  tasks,
  VALID_TOKEN,
  getNextTaskId: () => nextTaskId++,
  resetData
};
