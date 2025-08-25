import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Task, ViewType } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((tasks: Task[]) => Task[])) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  getTodaysTasks: () => Task[];
  getBacklogTasks: () => Task[];
  getCompletedTasks: () => Task[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function TaskProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API helper function
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  };

  // Fetch tasks from API
  const refreshTasks = async () => {
    if (!isAuthenticated || !token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiCall('/tasks');
      setTasks(data.tasks || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshTasks();
    } else {
      setTasks([]);
    }
  }, [isAuthenticated, token]);

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at'>) => {
    if (!isAuthenticated || !token) throw new Error('Not authenticated');
    
    setError(null);
    try {
      const data = await apiCall('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });
      
      // Handle different response formats
      if (data.template && data.instance) {
        // Recurring task: add both template and instance
        setTasks(prev => [...prev, data.template, data.instance]);
      } else if (Array.isArray(data)) {
        // Regular task returned as array
        setTasks(prev => [...prev, data[0]]);
      } else {
        // Regular task returned as object
        setTasks(prev => [...prev, data]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!isAuthenticated || !token) throw new Error('Not authenticated');
    
    setError(null);
    try {
      const data = await apiCall(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? data.task : task
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    if (!isAuthenticated || !token) throw new Error('Not authenticated');
    
    setError(null);
    try {
      await apiCall(`/tasks/${id}`, {
        method: 'DELETE',
      });
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  };

  const completeTask = async (id: string) => {
    await updateTask(id, { 
      completed: true, 
      completed_at: new Date().toISOString() 
    });
  };

  const getTodaysTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      task && task.due_date && new Date(task.due_date).toDateString() === today
    );
  };

  const getBacklogTasks = () => {
    return tasks.filter(task => 
      task && 
      !task.completed && 
      !task.template_id // Exclude recurring task instances (only show templates)
    );
  };

  const getCompletedTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      task && task.completed && 
      task.completed_at && 
      new Date(task.completed_at).toDateString() === today
    );
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      currentView,
      setCurrentView,
      addTask,
      updateTask,
      deleteTask,
      completeTask,
      getTodaysTasks,
      getBacklogTasks,
      getCompletedTasks,
      loading,
      error,
      refreshTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}