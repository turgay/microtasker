import React from 'react';
import { 
  Package, 
  Calendar, 
  CheckSquare, 
  BarChart3
} from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import { ViewType } from '../../types';

const navItems = [
  { view: 'backlog' as ViewType, icon: Package, label: 'Backlog', color: 'text-blue-600' },
  { view: 'planning' as ViewType, icon: Calendar, label: 'Planning', color: 'text-purple-600' },
  { view: 'today' as ViewType, icon: CheckSquare, label: 'Today', color: 'text-red-600' },
  { view: 'progress' as ViewType, icon: BarChart3, label: 'Progress', color: 'text-amber-600' },
];

export function Navigation() {
  const { currentView, setCurrentView } = useTaskContext();

  return (
    <nav className="bg-white border-r border-gray-200 w-64 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare className="w-7 h-7 text-blue-600" />
          MicroTasker
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Capture. Plan. Execute.
        </p>
      </div>

      <div className="space-y-2">
        {navItems.map(({ view, icon: Icon, label, color }) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
              ${currentView === view 
                ? 'bg-blue-50 border-l-4 border-blue-600 text-blue-700' 
                : 'hover:bg-gray-50 text-gray-700'
              }
            `}
          >
            <Icon className={`w-5 h-5 ${currentView === view ? 'text-blue-600' : color}`} />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}