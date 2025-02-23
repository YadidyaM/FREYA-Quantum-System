import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorData } from '../datasets/sensor/types';

interface AnomalyChartProps {
  data: SensorData[];
  metric: 'temperature' | 'vibration_level' | 'power_consumption' | 'pressure';
  color: string;
}

const AnomalyChart: React.FC<AnomalyChartProps> = ({ data, metric, color }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
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
          dataKey={metric}
          stroke={color}
          strokeWidth={2}
          dot={{
            fill: color,
            stroke: color,
            r: 4,
          }}
          activeDot={{
            r: 8,
            fill: color,
            stroke: '#F3F4F6',
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AnomalyChart;