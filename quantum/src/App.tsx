import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AnomalyDetection from './pages/AnomalyDetection';
import MaintenancePlanner from './pages/MaintenancePlanner';
import PredictiveAnalysis from './pages/PredictiveAnalysis';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, Linkedin, X, AlertTriangle, CheckCircle, Cpu, Gauge, Network, Moon, Sun, Volume2, VolumeX } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

function App() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      message: 'Quantum system calibration complete',
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: '2',
      type: 'warning',
      message: 'Memory usage approaching threshold',
      timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
    }
  ]);

  const [theme, setTheme] = useState({
    mode: 'dark',
    primary: 'indigo',
    accent: 'purple'
  });

  const [settings, setSettings] = useState({
    notifications: true,
    sound: true
  });

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'dark' ? 'light' : 'dark'
    }));
    document.documentElement.classList.toggle('dark');
  };

  const toggleNotifications = () => {
    setSettings(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, sound: !prev.sound }));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <Router>
      <div className={`flex h-screen ${
        theme.mode === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
          : 'bg-gradient-to-br from-gray-100 via-white to-gray-100 text-gray-900'
      }`}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
                  Freya
                </h1>
                <span className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded-full">
                  System Online
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="p-2 text-indigo-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                  title="System Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <button 
                  className="p-2 text-purple-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  onClick={() => setShowSettings(!showSettings)}
                  title="System Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-4 top-16 w-96 bg-gray-800 rounded-lg shadow-lg border border-white/10 z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Notifications</h2>
                    <button
                      onClick={clearNotifications}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className="p-4 border-b border-white/10 hover:bg-white/5"
                      >
                        <div className="flex items-start gap-3">
                          {notification.type === 'success' && (
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                          )}
                          {notification.type === 'warning' && (
                            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                          )}
                          {notification.type === 'error' && (
                            <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                          )}
                          <div>
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-4 top-16 w-80 bg-gray-800 rounded-lg shadow-lg border border-white/10 z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Settings</h2>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {theme.mode === 'dark' ? (
                        <Moon className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-yellow-400" />
                      )}
                      <span>Theme</span>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20"
                    >
                      {theme.mode === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <span>Notifications</span>
                    </div>
                    <button
                      onClick={toggleNotifications}
                      className={`px-3 py-1 rounded-lg ${
                        settings.notifications
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {settings.notifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.sound ? (
                        <Volume2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-gray-400" />
                      )}
                      <span>Sound</span>
                    </div>
                    <button
                      onClick={toggleSound}
                      className={`px-3 py-1 rounded-lg ${
                        settings.sound
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {settings.sound ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-indigo-400" />
                        <div>
                          <p className="text-sm font-medium">System Version</p>
                          <p className="text-xs text-gray-400">v2.5.0</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Gauge className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm font-medium">Quantum Core</p>
                          <p className="text-xs text-gray-400">Active</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Network className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium">Network Status</p>
                          <p className="text-xs text-gray-400">Connected (128 MB/s)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-indigo-900/50 to-purple-900/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="container mx-auto px-6 py-8"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/anomaly-detection" element={<AnomalyDetection />} />
                <Route path="/maintenance-planner" element={<MaintenancePlanner />} />
                <Route path="/predictive-analysis" element={<PredictiveAnalysis />} />
              </Routes>
            </motion.div>
          </main>

          {/* Status Bar with Credits */}
          <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="flex flex-col px-6 py-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-400">System Status: Optimal</span>
                  </div>
                  <div className="text-sm text-gray-500">|</div>
                  <div className="text-sm text-gray-400">Last Update: {new Date().toLocaleTimeString()}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-400">Quantum Core: Active</div>
                  <div className="text-sm text-gray-500">|</div>
                  <div className="text-sm text-gray-400">Memory Usage: 42%</div>
                  <div className="text-sm text-gray-500">|</div>
                  <div className="text-sm text-gray-400">Network: 128 MB/s</div>
                </div>
              </div>
              
              {/* Credits Section */}
              <div className="text-xs text-gray-400 flex items-center justify-center space-x-8 pt-1 border-t border-white/5">
                <div className="flex items-center">
                  <span className="font-medium">Developed by:</span>
                </div>
                <a href="https://lablab.ai/u/@meghana_01" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Meghana Nagaraja
                </a>
                <a href="https://www.linkedin.com/in/meghnagaraja01ai/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <div className="text-gray-500">|</div>
                <a href="https://lablab.ai/u/@Yadidya" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Yadidya Medepalli
                </a>
                <a href="https://www.linkedin.com/in/yadidya-medepalli/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <div className="text-gray-500">|</div>
                <a href="https://lablab.ai/u/@Mon_mj" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Monica Jayakumar
                </a>
                <a href="https://www.linkedin.com/in/monicajayakumar/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;