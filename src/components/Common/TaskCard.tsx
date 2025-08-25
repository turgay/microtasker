import { useState } from 'react';
import { Task, Priority, CategoryName, TimeEstimate, RepeatType } from '../../types';
import { getCategoryColor, categories } from '../../data/categories';
import { 
  Clock, 
  Calendar, 
  AlertCircle, 
  Check, 
  Trash2, 
  ArrowRight,
  Repeat,
  Edit3,
  Save,
  X
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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    category: task.category,
    priority: task.priority,
    time_estimate: task.time_estimate || '5-10 min',
    due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    frequency: task.frequency,
    is_recurring: task.is_recurring || false,
    start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : '',
    end_date: task.end_date ? new Date(task.end_date).toISOString().split('T')[0] : ''
  });
  
  const categoryColorClass = task.category ? getCategoryColor(task.category) : '';

  const handleDefer = () => {
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

  const handleEdit = () => {
    setIsEditing(true);
    if (onEdit) onEdit();
  };

  const handleSave = async () => {
    try {
      const updateData = {
        title: editData.title,
        ...(editData.category && { category: editData.category }),
        ...(editData.priority && { priority: editData.priority }),
        time_estimate: editData.time_estimate,
        ...(editData.due_date && { due_date: editData.due_date }),
        ...(editData.is_recurring && editData.frequency && { frequency: editData.frequency }),
        is_recurring: editData.is_recurring,
        ...(editData.start_date && { start_date: editData.start_date }),
        ...(editData.end_date && { end_date: editData.end_date })
      };
      console.log('Sending update data:', updateData);
      await updateTask(task.id, updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      category: task.category,
      priority: task.priority,
      time_estimate: task.time_estimate || '5-10 min',
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      frequency: task.frequency,
      is_recurring: task.is_recurring || false,
      start_date: task.start_date ? new Date(task.start_date).toISOString().split('T')[0] : '',
      end_date: task.end_date ? new Date(task.end_date).toISOString().split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const timeEstimates: TimeEstimate[] = ['2-5 min', '5-10 min', '10+ min'];
  const frequencies: RepeatType[] = ['daily', 'weekly', 'monthly'];

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-blue-300 dark:border-blue-600 p-4 space-y-3">
        {/* Title */}
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Task title"
        />
        
        {/* Form fields in a grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Category */}
          <select
            value={editData.category || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value as CategoryName || null }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">No category</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          
          {/* Priority */}
          <select
            value={editData.priority || ''}
            onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value === '' ? null : e.target.value as Priority }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="">No priority</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          
          {/* Time Estimate */}
          <select
            value={editData.time_estimate}
            onChange={(e) => setEditData(prev => ({ ...prev, time_estimate: e.target.value as TimeEstimate }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          >
            {timeEstimates.map(estimate => (
              <option key={estimate} value={estimate}>{estimate}</option>
            ))}
          </select>
          
          {/* Due Date */}
          <input
            type="date"
            value={editData.due_date}
            onChange={(e) => setEditData(prev => ({ ...prev, due_date: e.target.value }))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>
        
        {/* Recurring options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editData.is_recurring}
              onChange={(e) => setEditData(prev => ({ ...prev, is_recurring: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Recurring</span>
          </label>
          
          {editData.is_recurring && (
            <select
              value={editData.frequency || 'daily'}
              onChange={(e) => setEditData(prev => ({ ...prev, frequency: e.target.value as RepeatType }))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
            >
              {frequencies.map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          )}
        </div>
        
        {/* Recurring Date Range */}
        {editData.is_recurring && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={editData.start_date}
                onChange={(e) => setEditData(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={editData.end_date}
                onChange={(e) => setEditData(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
          >
            <Save className="w-3 h-3" />
            Save
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
          >
            <X className="w-3 h-3" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-center gap-2">
        {/* Checkbox for completion */}
        {showActions && (
          <button
            onClick={() => completeTask(task.id)}
            className="flex-shrink-0 w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded hover:border-green-500 dark:hover:border-green-400 transition-colors flex items-center justify-center"
          >
            <Check className="w-2.5 h-2.5 text-green-600 opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Main content - title on left, metadata on right */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
          <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
            {task.title}
          </h3>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {task.priority && (
              <AlertCircle className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
            )}

            {task.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
              >
                #{tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="text-xs text-gray-400">+{task.tags.length - 2}</span>
            )}

            {task.is_recurring && (
              <span className="px-1.5 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded flex items-center gap-1">
                <Repeat className="w-2.5 h-2.5" />
                {task.frequency || 'daily'}
              </span>
            )}

            {showDate && task.due_date && (
              <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}

            <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {task.time_estimate}
            </span>
            
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${task.category ? categoryColorClass : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
              {task.category || '?'}
            </span>
          </div>
        </div>

        {/* Actions on the right */}
        {showActions && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Edit task"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            
            <button
              onClick={handleDefer}
              className="p-1 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded transition-colors"
              title="Defer to tomorrow"
            >
              <ArrowRight className="w-3 h-3" />
            </button>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}