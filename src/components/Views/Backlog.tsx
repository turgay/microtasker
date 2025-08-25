import React, { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { TaskCard } from '../Common/TaskCard';
import { FilterType } from '../../types';

export function Backlog() {
  const { getBacklogTasks } = useTaskContext();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const backlogTasks = getBacklogTasks();
  
  const filteredTasks = backlogTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'uncategorized':
        return !task.category;
      case 'categorized':
        return task.category;
      case 'planned':
        return task.due_date;
      case 'unplanned':
        return !task.due_date;
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Backlog
          </h2>
          <p className="text-gray-600">
            Organize and plan your captured tasks. {backlogTasks.length} tasks waiting.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setFilter('uncategorized')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'uncategorized'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              Uncategorized
            </button>
            <button
              onClick={() => setFilter('categorized')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'categorized'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              Categorized
            </button>
            <button
              onClick={() => setFilter('planned')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'planned'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              Planned
            </button>
            <button
              onClick={() => setFilter('unplanned')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'unplanned'
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              Unplanned
            </button>
          </div>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">
            {backlogTasks.length === 0 ? 'No tasks in backlog' : 'No matching tasks'}
          </h3>
          <p className="text-gray-400">
            {backlogTasks.length === 0 
              ? 'Capture some tasks to get started!' 
              : 'Try adjusting your search or filter.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-1">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              showDate={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}