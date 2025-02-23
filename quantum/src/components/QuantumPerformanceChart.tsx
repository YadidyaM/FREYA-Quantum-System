import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface PerformanceData {
  timestamp: number;
  riskLevel: number;
  costEfficiency: number;
  maintenanceOptimization: number;
  resourceUtilization: number;
}

interface QuantumPerformanceChartProps {
  data: PerformanceData[];
}

const QuantumPerformanceChart: React.FC<QuantumPerformanceChartProps> = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState<
    'riskLevel' | 'costEfficiency' | 'maintenanceOptimization' | 'resourceUtilization'
  >('riskLevel');

  const metrics = {
    riskLevel: { name: 'Risk Level', color: '#EF4444' },
    costEfficiency: { name: 'Cost Efficiency', color: '#10B981' },
    maintenanceOptimization: { name: 'Maintenance Optimization', color: '#6366F1' },
    resourceUtilization: { name: 'Resource Utilization', color: '#F59E0B' }
  };

  return (
    <div className="h-full">
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(metrics).map(([key, { name, color }]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMetric(key as keyof typeof metrics)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedMetric === key
                ? `bg-opacity-20 text-${color}`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            style={{
              backgroundColor: selectedMetric === key ? `${color}33` : undefined,
              color: selectedMetric === key ? color : undefined
            }}
          >
            {name}
          </motion.button>
        ))}
      </div>

      <div className="h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
              stroke="#9CA3AF"
            />
            <YAxis 
              stroke="#9CA3AF"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6',
              }}
              formatter={(value: number) => [
                `${(value * 100).toFixed(2)}%`,
                metrics[selectedMetric].name
              ]}
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={metrics[selectedMetric].color}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: metrics[selectedMetric].color,
                strokeWidth: 0
              }}
              activeDot={{
                r: 8,
                fill: metrics[selectedMetric].color,
                stroke: '#F3F4F6',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuantumPerformanceChart;