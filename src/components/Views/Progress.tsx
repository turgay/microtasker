import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Award,
  BookOpen,
  PenTool,
  MessageCircle,
  GraduationCap,
  Heart,
  Coffee,
  Hammer
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { categories } from '../../data/categories';

export function Progress() {
  const { tasks } = useTaskContext();
  
  // Today's stats
  const today = new Date().toDateString();
  const todaysCompleted = tasks.filter(task => 
    task.completed && 
    task.completed_at && 
    new Date(task.completed_at).toDateString() === today
  );

  // Weekly stats (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const weeklyCompleted = tasks.filter(task =>
    task.completed && 
    task.completed_at &&
    new Date(task.completed_at) >= weekAgo
  );

  // Category breakdown
  const categoryStats = categories.map(category => {
    const categoryTasks = weeklyCompleted.filter(task => task.category === category.name);
    return {
      ...category,
      count: categoryTasks.length,
      percentage: weeklyCompleted.length > 0 ? 
        Math.round((categoryTasks.length / weeklyCompleted.length) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  // Streak calculation (simplified)
  const getStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < 30) { // Max 30 days check
      const dateString = currentDate.toDateString();
      const hasTasksCompleted = tasks.some(task =>
        task.completed && 
        task.completed_at &&
        new Date(task.completed_at).toDateString() === dateString
      );
      
      if (!hasTasksCompleted) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const currentStreak = getStreak();
  const totalCompleted = tasks.filter(task => task.completed).length;
  const completionRate = tasks.length > 0 ? 
    Math.round((totalCompleted / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-amber-600" />
            Progress & Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your productivity and celebrate your achievements.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Today
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {todaysCompleted.length}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              tasks completed
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                This Week
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {weeklyCompleted.length}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              tasks completed
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Current Streak
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {currentStreak}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              days in a row
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Completion Rate
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {completionRate}%
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400">
              overall success
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Weekly Category Breakdown
        </h3>
        
        {weeklyCompleted.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              Complete some tasks to see your progress breakdown.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryStats.filter(stat => stat.count > 0).map(stat => {
              const iconMap: Record<string, React.ComponentType<any>> = {
                BookOpen,
                PenTool,
                MessageCircle,
                GraduationCap,
                Heart,
                Coffee,
                Hammer
              };
              const IconComponent = iconMap[stat.icon] || BarChart3;
              return (
                <div key={stat.name} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-24">
                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stat.name}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stat.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivational Section */}
      {currentStreak >= 3 && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8" />
            <h3 className="text-xl font-bold">Great Momentum! 🎉</h3>
          </div>
          <p className="text-green-100">
            You're on a {currentStreak}-day streak! Keep up the excellent work and maintain this productive habit.
          </p>
        </div>
      )}
    </div>
  );
}