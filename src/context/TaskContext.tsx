import React, { createContext, useContext, ReactNode } from 'react';
import { Task, ViewType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TaskContextType {
  tasks: Task[];
  setTasks: (tasks: Task[] | ((tasks: Task[]) => Task[])) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTodaysTasks: () => Task[];
  getBacklogTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>('microtasker-tasks', []);
  const [currentView, setCurrentView] = useLocalStorage<ViewType>('microtasker-view', 'today');

  const addTask = (taskData: Omit<Task, 'id' | 'created_at'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const completeTask = (id: string) => {
    updateTask(id, { 
      completed: true, 
      completed_at: new Date().toISOString() 
    });
  };

  const getTodaysTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      task.due_date && new Date(task.due_date).toDateString() === today
    );
  };

  const getBacklogTasks = () => {
    return tasks.filter(task => !task.completed && !task.due_date);
  };

  const getCompletedTasks = () => {
    const today = new Date().toDateString();
    return tasks.filter(task => 
      task.completed && 
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
      getCompletedTasks
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