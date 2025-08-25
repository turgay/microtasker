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
  body('category').optional({ values: 'null' }).isIn(['Read', 'Write', 'Speak', 'Learn', 'Pray', 'Break', 'Build']),
  body('priority').optional({ values: 'null' }).isIn(['High', 'Medium', 'Low']),
  body('time_estimate').optional().isIn(['2-5 min', '5-10 min', '10+ min']),
  body('repeat').optional().isIn(['daily', 'weekly', 'monthly', 'none']),
  body('tags').optional().isArray(),
  body('due_date').optional({ values: 'falsy' }).isISO8601(),
  body('is_recurring').optional().isBoolean(),
  body('start_date').optional({ values: 'falsy' }).isISO8601(),
  body('end_date').optional({ values: 'falsy' }).isISO8601(),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly'])
], async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Task creation request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { 
      title, 
      category, 
      priority, 
      time_estimate, 
      repeat, 
      tags, 
      due_date,
      is_recurring,
      start_date,
      end_date,
      frequency
    } = req.body;

    // If it's a recurring task, create template and first instance
    if (is_recurring && start_date) {
      // Create the template task
      const [templateTask] = await db.insert(tasks).values({
        user_id: (req as any).userId,
        title,
        category: category || null,
        priority: priority || null,
        time_estimate: time_estimate || '2-5 min',
        repeat: repeat || 'none',
        tags: tags || [],
        is_recurring: true,
        is_template: true,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : null,
        frequency: frequency || 'daily',
      }).returning();

      // Create the first instance
      const [firstInstance] = await db.insert(tasks).values({
        user_id: (req as any).userId,
        title,
        category: category || null,
        priority: priority || null,
        time_estimate: time_estimate || '2-5 min',
        repeat: repeat || 'none',
        tags: tags || [],
        due_date: new Date(start_date),
        is_recurring: true,
        is_template: false,
        template_id: templateTask.id,
      }).returning();

      res.status(201).json({ template: templateTask, instance: firstInstance });
      return;
    } else {
      // Create regular task
      const [newTask] = await db.insert(tasks).values({
        user_id: (req as any).userId,
        title,
        category: category || null,
        priority: priority || null,
        time_estimate: time_estimate || '2-5 min',
        repeat: repeat || 'none',
        tags: tags || [],
        due_date: due_date ? new Date(due_date) : null,
      }).returning();

      res.status(201).json(newTask);
      return;
    }
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to create task' });
    return;
  }
});

// Update task
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('category').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return ['Read', 'Write', 'Speak', 'Learn', 'Pray', 'Break', 'Build'].includes(value);
  }),
  body('priority').optional().custom((value) => {
    if (value === null || value === undefined || value === '') return true;
    return ['High', 'Medium', 'Low'].includes(value);
  }),
  body('time_estimate').optional().isIn(['2-5 min', '5-10 min', '10+ min']),
  body('repeat').optional().isIn(['daily', 'weekly', 'custom', 'none']),
  body('frequency').optional().isIn(['daily', 'weekly', 'monthly']),
  body('is_recurring').optional().isBoolean(),
  body('completed').optional().isBoolean(),
  body('tags').optional().isArray(),
  body('due_date').optional().custom((value) => {
    if (value === '' || value === null || value === undefined) return true;
    return new Date(value).toString() !== 'Invalid Date';
  })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request body:', req.body);
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

    // Handle date conversions
    if (updates.due_date) {
      updates.due_date = new Date(updates.due_date);
    }
    if (updates.start_date) {
      updates.start_date = new Date(updates.start_date);
    }
    if (updates.end_date) {
      updates.end_date = new Date(updates.end_date);
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

// Helper function to calculate next occurrence date
function getNextOccurrenceDate(currentDate: Date, frequency: string): Date {
  const nextDate = new Date(currentDate);
  
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      nextDate.setDate(nextDate.getDate() + 1);
  }
  
  return nextDate;
}

// Complete task
router.patch('/:id/complete', [
  authenticateToken
], async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // First, get the task to check if it's recurring
    const [taskToComplete] = await db.select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.user_id, (req as any).user.id)))
      .limit(1);

    if (!taskToComplete) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Complete the current task
    const [updatedTask] = await db.update(tasks)
      .set({ 
        completed: true,
        completed_at: new Date(),
        updated_at: new Date()
      })
      .where(and(eq(tasks.id, id), eq(tasks.user_id, (req as any).user.id)))
      .returning();

    // If it's a recurring task instance, generate the next occurrence
    if (taskToComplete.is_recurring && taskToComplete.template_id && !taskToComplete.is_template) {
      // Get the template to check end_date and frequency
      const [template] = await db.select()
        .from(tasks)
        .where(eq(tasks.id, taskToComplete.template_id))
        .limit(1);

      if (template && template.frequency) {
        const nextDate = getNextOccurrenceDate(taskToComplete.due_date || new Date(), template.frequency);
        
        // Check if we should create next instance (not past end_date)
        const shouldCreateNext = !template.end_date || nextDate <= template.end_date;
        
        if (shouldCreateNext) {
          await db.insert(tasks).values({
            user_id: (req as any).userId,
            title: template.title,
            category: template.category,
            priority: template.priority,
            time_estimate: template.time_estimate,
            repeat: template.repeat,
            tags: template.tags,
            due_date: nextDate,
            is_recurring: true,
            is_template: false,
            template_id: template.id,
          });
        }
      }
    }

    res.json(updatedTask);
    return;
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ message: 'Failed to complete task' });
    return;
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
