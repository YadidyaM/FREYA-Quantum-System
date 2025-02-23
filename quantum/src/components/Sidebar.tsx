import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Calendar, 
  LineChart,
  Cpu,
  Command,
  Layers,
  Shield,
  Microscope,
  Atom
} from 'lucide-react';
import SystemCommands from './SystemCommands';
import SystemResources from './SystemResources';
import SystemSecurity from './SystemSecurity';
import QuantumBlueprint from './QuantumBlueprint';
import QuantumComputing from './QuantumComputing';

const Sidebar = () => {
  const [activeSystemPanel, setActiveSystemPanel] = useState<string | null>(null);

  const renderSystemPanel = () => {
    switch (activeSystemPanel) {
      case 'commands':
        return <SystemCommands />;
      case 'resources':
        return <SystemResources />;
      case 'security':
        return <SystemSecurity />;
      case 'quantum':
        return <QuantumComputing />;
      case 'blueprint':
        return <QuantumBlueprint />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Cpu className="h-8 w-8 text-blue-500 animate-spin-slow" />
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">Freya</span>
              <div className="text-xs text-gray-400">Quantum Intelligence</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-4">
              <div className="px-3 py-2">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main Navigation
                </h2>
              </div>
              <nav className="space-y-1">
                <NavLink 
                  to="/" 
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`
                  }
                >
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  Dashboard
                </NavLink>

                <NavLink 
                  to="/anomaly-detection"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-red-500/10 text-red-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`
                  }
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  Anomaly Detection
                </NavLink>

                <NavLink 
                  to="/maintenance-planner"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-purple-500/10 text-purple-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`
                  }
                >
                  <Calendar className="w-5 h-5 mr-3" />
                  Maintenance Planner
                </NavLink>

                <NavLink 
                  to="/predictive-analysis"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`
                  }
                >
                  <LineChart className="w-5 h-5 mr-3" />
                  Predictive Analysis
                </NavLink>
              </nav>
            </div>

            <div className="mb-4">
              <div className="px-3 py-2">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  System
                </h2>
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSystemPanel(activeSystemPanel === 'commands' ? null : 'commands')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors w-full ${
                    activeSystemPanel === 'commands' ? 'bg-blue-500/10 text-blue-400' : ''
                  }`}
                >
                  <Command className="w-5 h-5 mr-3" />
                  Commands
                </button>
                <button
                  onClick={() => setActiveSystemPanel(activeSystemPanel === 'resources' ? null : 'resources')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors w-full ${
                    activeSystemPanel === 'resources' ? 'bg-emerald-500/10 text-emerald-400' : ''
                  }`}
                >
                  <Layers className="w-5 h-5 mr-3" />
                  Resources
                </button>
                <button
                  onClick={() => setActiveSystemPanel(activeSystemPanel === 'security' ? null : 'security')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors w-full ${
                    activeSystemPanel === 'security' ? 'bg-purple-500/10 text-purple-400' : ''
                  }`}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Security
                </button>
                <button
                  onClick={() => setActiveSystemPanel(activeSystemPanel === 'quantum' ? null : 'quantum')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors w-full ${
                    activeSystemPanel === 'quantum' ? 'bg-blue-500/10 text-blue-400' : ''
                  }`}
                >
                  <Atom className="w-5 h-5 mr-3" />
                  Quantum Computing
                </button>
                <button
                  onClick={() => setActiveSystemPanel(activeSystemPanel === 'blueprint' ? null : 'blueprint')}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors w-full ${
                    activeSystemPanel === 'blueprint' ? 'bg-indigo-500/10 text-indigo-400' : ''
                  }`}
                >
                  <Microscope className="w-5 h-5 mr-3" />
                  Quantum Blueprint
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-gray-700">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-400">System Health</span>
                <span className="text-sm text-emerald-400">98%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeSystemPanel && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setActiveSystemPanel(null)}>
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="absolute left-64 top-0 bottom-0 w-[800px] bg-gray-900 p-6 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {renderSystemPanel()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;