import { CheckCircle, Clock, Target, ArrowRight, Zap } from 'lucide-react';

interface LandingPageProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export function LandingPage({ onSignUp, onLogin }: LandingPageProps) {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quick Capture",
      description: "Add tasks in seconds with minimal friction"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "7 Life Categories",
      description: "Organize tasks across Read, Write, Speak, Learn, Pray, Break, Build"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Estimates",
      description: "Track 2-5 min micro-tasks that fit into any schedule"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "See your productivity patterns and celebrate wins"
    }
  ];

  const categories = [
    { name: 'Read', icon: '📖', color: 'bg-blue-100 text-blue-800' },
    { name: 'Write', icon: '✍️', color: 'bg-green-100 text-green-800' },
    { name: 'Speak', icon: '💬', color: 'bg-purple-100 text-purple-800' },
    { name: 'Learn', icon: '🎓', color: 'bg-orange-100 text-orange-800' },
    { name: 'Pray', icon: '💝', color: 'bg-pink-100 text-pink-800' },
    { name: 'Break', icon: '☕', color: 'bg-amber-100 text-amber-800' },
    { name: 'Build', icon: '🔨', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MicroTasker</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={onSignUp}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Turn Spare Time into Progress —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              One Micro-Task at a Time
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform scattered moments into meaningful progress. Capture, organize, and complete 
            micro-tasks across seven key areas of life with minimal friction and maximum impact.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onSignUp}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onLogin}
              className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
            >
              Sign In
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            No credit card required • Start organizing in seconds
          </p>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seven Areas of Life, One Simple System
            </h2>
            <p className="text-lg text-gray-600">
              Organize every aspect of your life with purpose-built categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className={`${category.color} rounded-xl p-4 text-center transition-transform hover:scale-105`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold text-sm">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Your Busy Life
            </h2>
            <p className="text-lg text-gray-600">
              Every feature designed to minimize friction and maximize progress
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            See MicroTasker in Action
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border">
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-500 ml-4">MicroTasker Dashboard</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">📖 Read chapter on productivity</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">5-10 min</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                    <span className="text-sm">✍️ Write daily journal entry</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">2-5 min</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm line-through text-gray-500">☕ Take 5-minute break</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">2-5 min</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600">
              Quick capture, smart organization, and progress tracking — all in one clean interface
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands who've turned scattered moments into meaningful progress. 
            Start your journey today — it takes less than 30 seconds.
          </p>
          
          <button
            onClick={onSignUp}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Start Your Free Account</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="mt-4 text-blue-200 text-sm">
            Free forever • No credit card required • Ready in seconds
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MicroTasker</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2024 MicroTasker. Making productivity simple, one micro-task at a time.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
