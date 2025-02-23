import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

interface AnomalyMetrics {
  timestamp: string;
  temperature: number;
  vibration: number;
  power: number;
  pressure: number;
  anomalyScore: number;
  anomalyType: string | null;
}

interface RealTimeAnomalyChartProps {
  data: AnomalyMetrics[];
}

type ChartType = 'line' | 'area' | 'multi';
type MetricType = 'temperature' | 'vibration' | 'power' | 'pressure' | 'anomalyScore';

const RealTimeAnomalyChart: React.FC<RealTimeAnomalyChartProps> = ({ data }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('anomalyScore');

  const metrics = {
    temperature: { name: 'Temperature', color: '#EF4444', unit: '°C' },
    vibration: { name: 'Vibration', color: '#10B981', unit: '' },
    power: { name: 'Power', color: '#6366F1', unit: 'W' },
    pressure: { name: 'Pressure', color: '#F59E0B', unit: 'psi' },
    anomalyScore: { name: 'Anomaly Score', color: '#EC4899', unit: '' }
  };

  const renderChart = () => {
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6',
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={metrics[selectedMetric].color}
              fill={`${metrics[selectedMetric].color}33`}
            />
          </AreaChart>
        );

      case 'multi':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6',
              }}
            />
            <Legend />
            {Object.entries(metrics).map(([key, { color, name }]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={name}
                stroke={color}
                dot={false}
              />
            ))}
          </LineChart>
        );

      default:
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              stroke="#9CA3AF"
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={metrics[selectedMetric].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="h-full">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              chartType === 'line'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Line
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('area')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              chartType === 'area'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Area
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChartType('multi')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              chartType === 'multi'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Multi-metric
          </motion.button>
        </div>

        {chartType !== 'multi' && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(metrics).map(([key, { name, color }]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMetric(key as MetricType)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: selectedMetric === key ? `${color}33` : undefined,
                  color: selectedMetric === key ? color : '#9CA3AF'
                }}
              >
                {name}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="h-[calc(100%-3rem)]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RealTimeAnomalyChart;