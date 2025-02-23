import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RiskProfile {
  high: number;
  medium: number;
  low: number;
}

interface RiskAnalysisChartProps {
  riskProfile: RiskProfile;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

const RiskAnalysisChart: React.FC<RiskAnalysisChartProps> = ({ riskProfile }) => {
  const data = [
    { name: 'High Risk', value: riskProfile.high },
    { name: 'Medium Risk', value: riskProfile.medium },
    { name: 'Low Risk', value: riskProfile.low }
  ];

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#F3F4F6'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskAnalysisChart