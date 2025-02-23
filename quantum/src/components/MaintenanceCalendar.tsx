import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, PenTool as Tool, Calendar as CalendarIcon } from 'lucide-react';

interface MaintenanceTask {
  id: number;
  equipmentId: number;
  scheduledTime: number;
  priority: 'high' | 'medium' | 'low';
  type: 'Preventive' | 'Corrective' | 'Emergency';
  description: string;
  estimatedDuration: number;
  riskLevel: number;
}

interface MaintenanceCalendarProps {
  tasks: MaintenanceTask[];
}

const MaintenanceCalendar: React.FC<MaintenanceCalendarProps> = ({ tasks }) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay = startOfMonth.getDay();

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.scheduledTime).getDate();
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<number, MaintenanceTask[]>);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-gray-400 text-sm py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-gray-700/50 rounded-lg" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const date = i + 1;
          const dayTasks = tasksByDate[date] || [];
          const isToday = date === today.getDate();
          const hasTasks = dayTasks.length > 0;
          const hasHighPriority = dayTasks.some(task => task.priority === 'high');

          return (
            <motion.div
              key={date}
              whileHover={{ scale: 1.02 }}
              className={`aspect-square bg-gray-700 rounded-lg p-2 relative ${
                isToday ? 'ring-2 ring-blue-500' : ''
              } ${hasTasks ? 'cursor-pointer' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm ${isToday ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                  {date}
                </span>
                {hasHighPriority && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>

              {hasTasks && (
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="flex items-center gap-1">
                    <Tool className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{dayTasks.length}</span>
                  </div>
                </div>
              )}

              {hasTasks && (
                <div className="absolute inset-0 group">
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 w-64 p-2 bg-gray-900 rounded-lg shadow-lg z-10 mb-2">
                    <div className="space-y-2">
                      {dayTasks.map(task => (
                        <div
                          key={task.id}
                          className={`p-2 rounded-lg ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Equipment #{task.equipmentId}</span>
                            <span className="text-xs">{task.type}</span>
                          </div>
                          <p className="text-xs mt-1">{task.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedDuration.toFixed(1)}h</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenanceCalendar