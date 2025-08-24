import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { TaskCard } from '../Common/TaskCard';

export function Planning() {
  const { getBacklogTasks, updateTask, tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const unplannedTasks = getBacklogTasks().filter(task => !task.due_date);
  
  const getTasksForDate = (date: string) => {
    return tasks.filter(task => 
      !task.completed && 
      task.due_date && 
      task.due_date === date
    );
  };
  
  const selectedDateTasks = getTasksForDate(selectedDate);
  
  const handleScheduleTask = (taskId: string) => {
    updateTask(taskId, { due_date: selectedDate });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const quickDateOptions = [
    { label: 'Today', value: getTodayDate() },
    { label: 'Tomorrow', value: getTomorrowDate() },
    { 
      label: 'Next Week', 
      value: (() => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek.toISOString().split('T')[0];
      })()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            Planning
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and schedule tasks for any date. {selectedDateTasks.length} tasks planned for {new Date(selectedDate).toLocaleDateString()}.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Schedule tasks for:
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickDateOptions.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedDate(value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDate === value
                    ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Tasks scheduled for selected date */}
      {selectedDateTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Tasks for {new Date(selectedDate).toLocaleDateString()} ({selectedDateTasks.length})
          </h3>
          <div className="grid gap-3">
            {selectedDateTasks.map(task => (
              <TaskCard key={task.id} task={task} showActions={true} showDate={false} />
            ))}
          </div>
        </div>
      )}

      {/* Unplanned tasks section */}
      {unplannedTasks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Unplanned Tasks ({unplannedTasks.length})
          </h3>
          <div className="grid gap-4">
            {unplannedTasks.map(task => (
              <div key={task.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <TaskCard task={task} showActions={false} />
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <button
                      onClick={() => handleScheduleTask(task.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Schedule for {new Date(selectedDate).toLocaleDateString()}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {selectedDateTasks.length === 0 && unplannedTasks.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
            {selectedDate === new Date().toISOString().split('T')[0] 
              ? 'No tasks for today' 
              : `No tasks for ${new Date(selectedDate).toLocaleDateString()}`
            }
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            All your backlog tasks are scheduled! Use Quick Capture to add more tasks.
          </p>
        </div>
      )}
    </div>
  );
}