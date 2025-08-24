import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Register endpoint
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('name').optional().trim().isLength({ min: 2, max: 50 })
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      res.status(409).json({
        message: 'User already exists with this email'
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const [newUser] = await db.insert(users).values({
      email,
      password_hash,
      name: name || null,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      created_at: users.created_at,
      last_login: users.last_login
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Internal server error during registration'
    });
  }
});

// Login endpoint
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req: Request, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      res.status(401).json({
        message: 'Invalid email or password'
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      res.status(401).json({
        message: 'Invalid email or password'
      });
      return;
    }

    // Update last login
    await db.update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, user.id));

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data without password
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        last_login: new Date().toISOString()
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login'
    });
  }
});

// Verify token endpoint
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({
        message: 'No token provided'
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Get user data
    const [user] = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      created_at: users.created_at,
      last_login: users.last_login
    }).from(users).where(eq(users.id, decoded.userId));

    if (!user) {
      res.status(401).json({
        message: 'Invalid token - user not found'
      });
      return;
    }

    res.json({
      user,
      valid: true
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
});

export { router as authRoutes };
