import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { tasks, users } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware to authenticate and extract user ID
const authenticateToken = async (req: Request, res: Response, next: Function) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Verify user exists
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
    if (!user) {
      res.status(401).json({ message: 'Invalid token - user not found' });
      return;
    }

    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Get all tasks for authenticated user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const userTasks = await db.select()
      .from(tasks)
      .where(eq(tasks.user_id, userId))
      .orderBy(desc(tasks.created_at));

    res.json({
      tasks: userTasks,
      count: userTasks.length
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// Create new task
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('category').optional().isIn(['Read', 'Write', 'Speak', 'Learn', 'Pray', 'Break', 'Build']),
  body('priority').optional().isIn(['High', 'Medium', 'Low']),
  body('time_estimate').optional().isIn(['2-5 min', '5-10 min', '10+ min']),
  body('repeat').optional().isIn(['daily', 'weekly', 'custom', 'none']),
  body('tags').optional().isArray(),
  body('due_date').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = (req as any).userId;
    const { title, category, priority, time_estimate, repeat, tags, due_date } = req.body;

    const [newTask] = await db.insert(tasks).values({
      user_id: userId,
      title,
      category: category || null,
      priority: priority || null,
      time_estimate: time_estimate || '2-5 min',
      repeat: repeat || 'none',
      tags: tags || [],
      due_date: due_date ? new Date(due_date) : null,
      completed: false
    }).returning();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('category').optional().isIn(['Read', 'Write', 'Speak', 'Learn', 'Pray', 'Break', 'Build']),
  body('priority').optional().isIn(['High', 'Medium', 'Low']),
  body('time_estimate').optional().isIn(['2-5 min', '5-10 min', '10+ min']),
  body('repeat').optional().isIn(['daily', 'weekly', 'custom', 'none']),
  body('completed').optional().isBoolean(),
  body('tags').optional().isArray(),
  body('due_date').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const userId = (req as any).userId;
    const taskId = req.params.id;
    const updates = req.body;

    // Check if task exists and belongs to user
    const [existingTask] = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)));

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Handle completion timestamp
    if (updates.completed === true && !existingTask.completed) {
      updates.completed_at = new Date();
    } else if (updates.completed === false) {
      updates.completed_at = null;
    }

    // Handle due_date conversion
    if (updates.due_date) {
      updates.due_date = new Date(updates.due_date);
    }

    updates.updated_at = new Date();

    const [updatedTask] = await db.update(tasks)
      .set(updates)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)))
      .returning();

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const taskId = req.params.id;

    // Check if task exists and belongs to user
    const [existingTask] = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)));

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await db.delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)));

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const taskId = req.params.id;

    const [task] = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.user_id, userId)));

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
});

export { router as taskRoutes };
