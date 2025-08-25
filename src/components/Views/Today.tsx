import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  Trophy, 
  AlertCircle,
  BookOpen,
  PenTool,
  MessageCircle,
  GraduationCap,
  Heart,
  Coffee,
  Hammer,
  RotateCcw,
  Trash2,
  List,
  Grid3X3
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { TaskCard } from '../Common/TaskCard';
import { categories } from '../../data/categories';

export function Today() {
  const { getTodaysTasks, getCompletedTasks, updateTask, deleteTask } = useTaskContext();
  const [isQuickView, setIsQuickView] = useState(true);
  
  const todaysTasks = getTodaysTasks().filter(task => !task.completed);
  const completedTasks = getCompletedTasks();
  
  const tasksByCategory = todaysTasks.reduce((acc, task) => {
    const category = task.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {} as Record<string, typeof todaysTasks>);

  // Priority-sorted tasks for Quick View
  const prioritySortedTasks = [...todaysTasks].sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    return bPriority - aPriority;
  });

  const totalEstimatedTime = todaysTasks.reduce((total, task) => {
    switch (task.time_estimate) {
      case '2-5 min': return total + 3.5;
      case '5-10 min': return total + 7.5;
      case '10+ min': return total + 15;
      default: return total;
    }
  }, 0);

  const completionRate = todaysTasks.length + completedTasks.length > 0 
    ? Math.round((completedTasks.length / (todaysTasks.length + completedTasks.length)) * 100)
    : 0;

  const handleMarkUndone = async (taskId: string) => {
    try {
      await updateTask(taskId, { completed: false });
    } catch (error) {
      console.error('Failed to mark task as undone:', error);
    }
  };

  const handleRemoveTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to remove task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-red-600" />
            Today's Focus
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Tasks Remaining
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {todaysTasks.length}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Completion Rate
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {completionRate}%
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Estimated Time
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {totalEstimatedTime.toFixed(0)} min
            </div>
          </div>
        </div>

        {/* Category Overview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Category Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map(category => {
              const categoryTasks = todaysTasks.filter(task => task.category === category.name);
              const completedCategoryTasks = completedTasks.filter(task => task.category === category.name);
              const totalCategoryTasks = categoryTasks.length + completedCategoryTasks.length;
              
              const iconMap: Record<string, React.ComponentType<any>> = {
                BookOpen,
                PenTool,
                MessageCircle,
                GraduationCap,
                Heart,
                Coffee,
                Hammer
              };
              const IconComponent = iconMap[category.icon] || AlertCircle;
              
              const colorMap: Record<string, string> = {
                blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
                green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
                purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
                orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
                pink: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300',
                amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
                red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              };
              const colorClass = colorMap[category.color] || 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300';

              return (
                <div key={category.name} className={`p-3 rounded-lg border ${colorClass}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <div className="text-xs font-medium">{category.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {totalCategoryTasks > 0 ? (
                        <div className="text-sm font-bold">{completedCategoryTasks.length}/{totalCategoryTasks}</div>
                      ) : (
                        <div className="text-sm font-bold opacity-50">-</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Today's Tasks ({todaysTasks.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuickView(false)}
            className={`p-2 rounded-lg transition-colors ${
              !isQuickView 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="Category View"
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsQuickView(true)}
            className={`p-2 rounded-lg transition-colors ${
              isQuickView 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="Quick View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pending Tasks */}
      {todaysTasks.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <CheckSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            No tasks scheduled for today
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Head to Planning to schedule some tasks or use Quick Capture to add new ones.
          </p>
        </div>
      ) : isQuickView ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-2">
            {prioritySortedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(tasksByCategory).map(([categoryName, tasks]) => (
            <div key={categoryName} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                {categoryName !== 'Uncategorized' && (
                  <>
                    {(() => {
                      const categoryData = categories.find(c => c.name === categoryName);
                      const iconMap: Record<string, React.ComponentType<any>> = {
                        BookOpen,
                        PenTool,
                        MessageCircle,
                        GraduationCap,
                        Heart,
                        Coffee,
                        Hammer
                      };
                      const IconComponent = categoryData && iconMap[categoryData.icon] 
                        ? iconMap[categoryData.icon] 
                        : AlertCircle;
                      return <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
                    })()}
                  </>
                )}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {categoryName} ({tasks.length})
                </h3>
              </div>
              <div className="grid gap-4">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">
              Completed Today ({completedTasks.length})
            </h3>
          </div>
          <div className="space-y-2">
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                <CheckSquare className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 line-through flex-1">
                  {task.title}
                </span>
                {task.time_estimate && (
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                    {task.time_estimate}
                  </span>
                )}
                {task.category && (
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                    {task.category}
                  </span>
                )}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleMarkUndone(task.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                    title="Mark as undone"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveTask(task.id)}
                    className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}