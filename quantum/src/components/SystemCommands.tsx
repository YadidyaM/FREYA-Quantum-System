import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Play, Square, RefreshCw, XCircle, CheckCircle, Loader2 } from 'lucide-react';

interface Command {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'error';
  lastRun: string;
}

const SystemCommands = () => {
  const [commands, setCommands] = useState<Command[]>([
    {
      id: 'quantum-calibration',
      name: 'Quantum Calibration',
      description: 'Calibrate quantum processing units',
      status: 'running',
      lastRun: '2 minutes ago'
    },
    {
      id: 'error-correction',
      name: 'Error Correction',
      description: 'Run quantum error correction protocols',
      status: 'stopped',
      lastRun: '15 minutes ago'
    },
    {
      id: 'decoherence-check',
      name: 'Decoherence Check',
      description: 'Check quantum state coherence',
      status: 'error',
      lastRun: '1 hour ago'
    }
  ]);

  const [isAddingCommand, setIsAddingCommand] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCommand, setNewCommand] = useState({
    name: '',
    description: ''
  });

  const toggleCommandStatus = (commandId: string) => {
    setCommands(currentCommands =>
      currentCommands.map(cmd => {
        if (cmd.id === commandId) {
          const newStatus = cmd.status === 'running' ? 'stopped' : 'running';
          return {
            ...cmd,
            status: newStatus,
            lastRun: 'Just now'
          };
        }
        return cmd;
      })
    );
  };

  const retryCommand = (commandId: string) => {
    setCommands(currentCommands =>
      currentCommands.map(cmd => {
        if (cmd.id === commandId) {
          return {
            ...cmd,
            status: 'running',
            lastRun: 'Just now'
          };
        }
        return cmd;
      })
    );
  };

  const resetForm = () => {
    setNewCommand({ name: '', description: '' });
    setFormError(null);
  };

  const handleCancel = () => {
    resetForm();
    setIsAddingCommand(false);
  };

  const validateForm = () => {
    if (!newCommand.name.trim()) {
      setFormError('Command name is required');
      return false;
    }
    if (!newCommand.description.trim()) {
      setFormError('Command description is required');
      return false;
    }
    if (commands.some(cmd => cmd.name.toLowerCase() === newCommand.name.toLowerCase())) {
      setFormError('A command with this name already exists');
      return false;
    }
    return true;
  };

  const addNewCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const command: Command = {
        id: `cmd-${Date.now()}`,
        name: newCommand.name.trim(),
        description: newCommand.description.trim(),
        status: 'stopped',
        lastRun: 'Never'
      };

      setCommands(current => [...current, command]);
      setShowSuccess(true);
      
      // Reset form after short delay
      setTimeout(() => {
        resetForm();
        setIsAddingCommand(false);
        setShowSuccess(false);
      }, 1500);

    } catch (error) {
      setFormError('Failed to add command. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">System Commands</h2>
        <button 
          onClick={() => setIsAddingCommand(true)}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2"
          disabled={isAddingCommand}
        >
          <Terminal className="w-4 h-4" />
          <span>New Command</span>
        </button>
      </div>

      <AnimatePresence>
        {isAddingCommand && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-gray-700 rounded-lg p-4"
            onSubmit={addNewCommand}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Command Name
                </label>
                <input
                  type="text"
                  value={newCommand.name}
                  onChange={(e) => {
                    setNewCommand(prev => ({ ...prev, name: e.target.value }));
                    setFormError(null);
                  }}
                  className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter command name"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newCommand.description}
                  onChange={(e) => {
                    setNewCommand(prev => ({ ...prev, description: e.target.value }));
                    setFormError(null);
                  }}
                  className="w-full bg-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter command description"
                  disabled={isSubmitting}
                />
              </div>

              {formError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {formError}
                </motion.div>
              )}

              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Command added successfully!
                </motion.div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4" />
                      Add Command
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {commands.map(command => (
          <motion.div
            key={command.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{command.name}</h3>
                <p className="text-sm text-gray-400">{command.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  command.status === 'running' ? 'bg-green-500/20 text-green-400' :
                  command.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {command.status}
                </span>
                <button 
                  onClick={() => toggleCommandStatus(command.id)}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                >
                  {command.status === 'running' ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
                <button 
                  onClick={() => retryCommand(command.id)}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last run: {command.lastRun}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SystemCommands;