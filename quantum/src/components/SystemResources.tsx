import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick as Memory, HardDrive, Network } from 'lucide-react';

interface Resource {
  name: string;
  usage: number;
  total: string;
  icon: React.ReactNode;
}

const SystemResources = () => {
  const [resources, setResources] = useState<Resource[]>([
    {
      name: 'CPU',
      usage: 98,
      total: 'Quantum Core',
      icon: <Cpu className="w-5 h-5" />
    },
    {
      name: 'Memory',
      usage: 42,
      total: '128 GB',
      icon: <Memory className="w-5 h-5" />
    },
    {
      name: 'Storage',
      usage: 39.3,
      total: '2 TB',
      icon: <HardDrive className="w-5 h-5" />
    },
    {
      name: 'Network',
      usage: 35,
      total: '128 MB/s',
      icon: <Network className="w-5 h-5" />
    }
  ]);

  useEffect(() => {
    // Update resources every 2 seconds
    const interval = setInterval(() => {
      setResources(current => current.map(resource => {
        let newUsage = resource.usage;
        
        switch (resource.name) {
          case 'CPU':
            // Simulate CPU fluctuations around 98%
            newUsage = 98 + (Math.random() * 2 - 1);
            break;
          case 'Memory':
            // Keep memory at 42% with small variations
            newUsage = 42 + (Math.random() * 2 - 1);
            break;
          case 'Storage':
            // Keep storage around 39.3% with minimal changes
            newUsage = 39.3 + (Math.random() * 0.2 - 0.1);
            break;
          case 'Network':
            // Simulate network fluctuations based on 128 MB/s max
            newUsage = (128 / 150) * 100 * (0.8 + Math.random() * 0.4);
            break;
        }

        return {
          ...resource,
          usage: Math.min(100, Math.max(0, newUsage))
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
        System Resources
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map(resource => (
          <motion.div
            key={resource.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700/50 backdrop-blur-sm border border-white/10 rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`text-${
                resource.usage > 80 ? 'red' :
                resource.usage > 60 ? 'yellow' :
                'blue'
              }-400`}>
                {resource.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">{resource.name}</h3>
                <p className="text-sm text-gray-300">{resource.total}</p>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-blue-400">
                    {resource.usage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resource.usage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    resource.usage > 80 ? 'bg-red-500' :
                    resource.usage > 60 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SystemResources;