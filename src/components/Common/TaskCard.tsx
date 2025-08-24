import React from 'react';
import { Task } from '../../types';
import { getCategoryColor, getCategoryData } from '../../data/categories';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  Check, 
  Trash2, 
  ArrowRight 
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';

interface TaskCardProps {
  task: Task;
  showActions?: boolean;
  showDate?: boolean;
  onEdit?: () => void;
}

export function TaskCard({ task, showActions = true, showDate = false, onEdit }: TaskCardProps) {
  const { completeTask, deleteTask, updateTask } = useTaskContext();
  
  const categoryData = task.category ? getCategoryData(task.category) : null;
  const categoryColorClass = task.category ? getCategoryColor(task.category) : '';

  const handleDefer = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateTask(task.id, { due_date: tomorrow.toISOString().split('T')[0] });
  };

  const handleMoveToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    updateTask(task.id, { due_date: tomorrow.toISOString().split('T')[0] });
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-3">
        {/* Checkbox for completion */}
        {showActions && (
          <button
            onClick={() => completeTask(task.id)}
            className="flex-shrink-0 w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded hover:border-green-500 dark:hover:border-green-400 transition-colors flex items-center justify-center"
          >
            <Check className="w-3 h-3 text-green-600 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">
              {task.title}
            </h3>
            {task.priority && (
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${getPriorityColor(task.priority)}`} />
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5">
            {task.category && (
              <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${categoryColorClass}`}>
                {task.category}
              </span>
            )}
            
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {task.time_estimate}
            </span>

            {showDate && task.due_date && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}

            {task.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions on the right */}
        {showActions && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleDefer}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
              title="Defer to tomorrow"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}