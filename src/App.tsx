import React from 'react';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Navigation } from './components/Layout/Navigation';
import { QuickCaptureSidebar } from './components/Common/QuickCaptureSidebar';
import { Backlog } from './components/Views/Backlog';
import { Planning } from './components/Views/Planning';
import { Today } from './components/Views/Today';
import { Progress } from './components/Views/Progress';

function AppContent() {
  const { currentView } = useTaskContext();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'backlog':
        return <Backlog />;
      case 'planning':
        return <Planning />;
      case 'today':
        return <Today />;
      case 'progress':
        return <Progress />;
      default:
        return <Today />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <QuickCaptureSidebar />
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;