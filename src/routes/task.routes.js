const express = require('express');
const router = express.Router();
const { tasks, getNextTaskId } = require('../data/tasks.data');
const { authenticateToken } = require('../middleware/auth.middleware');

// Protect all task routes with authentication
router.use(authenticateToken);

/**
 * @route   GET /api/tasks
 * @desc    Get all student tasks (supports optional status query)
 */
router.get('/', (req, res) => {
  const { status, course } = req.query;
  let result = [...tasks];

  if (status) {
    result = result.filter(
      (t) => t.status.toUpperCase() === status.toUpperCase()
    );
  }

  if (course) {
    result = result.filter(
      (t) => t.course.toUpperCase() === course.toUpperCase()
    );
  }

  return res.status(200).json({
    success: true,
    total: result.length,
    data: result
  });
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 */
router.get('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID format, must be an integer'
    });
  }

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${taskId} not found`
    });
  }

  return res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
router.post('/', (req, res) => {
  const { title, description, course, dueDate, priority, status } = req.body;

  // Validation: Title is required
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Task title is required'
    });
  }

  const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

  const normalizedStatus = status ? status.toUpperCase() : 'TODO';
  const normalizedPriority = priority ? priority.toUpperCase() : 'MEDIUM';

  if (status && !validStatuses.includes(normalizedStatus)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
    });
  }

  if (priority && !validPriorities.includes(normalizedPriority)) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${validPriorities.join(', ')}`
    });
  }

  const newTask = {
    id: getNextTaskId(),
    title: title.trim(),
    description: description ? description.trim() : '',
    course: course ? course.trim() : 'SWT301',
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    priority: normalizedPriority,
    status: normalizedStatus,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  return res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 */
router.put('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID format, must be an integer'
    });
  }

  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${taskId} not found`
    });
  }

  const { title, description, course, dueDate, priority, status } = req.body;

  // Validation: If title is provided, it cannot be empty
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Task title cannot be empty'
    });
  }

  const validStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

  if (status && !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
    });
  }

  if (priority && !validPriorities.includes(priority.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid priority. Allowed values: ${validPriorities.join(', ')}`
    });
  }

  const currentTask = tasks[index];
  const updatedTask = {
    ...currentTask,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(course !== undefined && { course: course.trim() }),
    ...(dueDate !== undefined && { dueDate }),
    ...(priority !== undefined && { priority: priority.toUpperCase() }),
    ...(status !== undefined && { status: status.toUpperCase() }),
    updatedAt: new Date().toISOString()
  };

  tasks[index] = updatedTask;

  return res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask
  });
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task by ID
 */
router.delete('/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID format, must be an integer'
    });
  }

  const index = tasks.findIndex((t) => t.id === taskId);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Task with ID ${taskId} not found`
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  return res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {
      id: deletedTask.id,
      title: deletedTask.title
    }
  });
});

module.exports = router;
