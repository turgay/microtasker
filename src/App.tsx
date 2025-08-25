import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Navigation } from './components/Layout/Navigation';
import { QuickCaptureSidebar } from './components/Common/QuickCaptureSidebar';
import { Backlog } from './components/Views/Backlog';
import { Planning } from './components/Views/Planning';
import { Today } from './components/Views/Today';
import { Progress } from './components/Views/Progress';
import { LandingPage } from './components/Views/LandingPage';
import { AuthForm, AuthFormData } from './components/Views/AuthForm';

type AppView = 'landing' | 'login' | 'register' | 'dashboard';

function Dashboard() {
  const { currentView } = useTaskContext();
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (currentView !== 'backlog') {
          setIsQuickCaptureOpen(prev => !prev);
        }
      }
      if (e.key === 'Escape' && currentView !== 'backlog') {
        setIsQuickCaptureOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

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

  const shouldShowQuickCapture = currentView === 'backlog' || isQuickCaptureOpen;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          <QuickCaptureSidebar 
            isOpen={shouldShowQuickCapture}
            onClose={() => setIsQuickCaptureOpen(false)}
          />
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading, login, register, error, clearError } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [authLoading, setAuthLoading] = useState(false);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show the dashboard
  if (isAuthenticated) {
    return (
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    );
  }

  // Handle authentication form submission
  const handleAuthSubmit = async (data: AuthFormData) => {
    setAuthLoading(true);
    clearError();
    
    try {
      if (currentView === 'login') {
        await login(data.email, data.password);
      } else if (currentView === 'register') {
        await register(data.email, data.password, data.name);
      }
      // Authentication successful - user will be redirected automatically
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setAuthLoading(false);
    }
  };

  // Render based on current view
  switch (currentView) {
    case 'login':
      return (
        <AuthForm
          mode="login"
          onSubmit={handleAuthSubmit}
          onModeSwitch={(mode) => setCurrentView(mode)}
          onBackToLanding={() => setCurrentView('landing')}
          loading={authLoading}
          error={error || undefined}
        />
      );
      
    case 'register':
      return (
        <AuthForm
          mode="register"
          onSubmit={handleAuthSubmit}
          onModeSwitch={(mode) => setCurrentView(mode)}
          onBackToLanding={() => setCurrentView('landing')}
          loading={authLoading}
          error={error || undefined}
        />
      );
      
    default:
      return (
        <LandingPage
          onSignUp={() => setCurrentView('register')}
          onLogin={() => setCurrentView('login')}
        />
      );
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;