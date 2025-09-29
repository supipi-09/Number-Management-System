import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { DashboardStats } from '../../types';

interface InventoryPieChartProps {
  data: DashboardStats;
}

const InventoryPieChart: React.FC<InventoryPieChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Available', value: data.availableNumbers, color: '#2e7d32' },
    { name: 'Allocated', value: data.allocatedNumbers, color: '#1976d2' },
    { name: 'Reserved', value: data.reservedNumbers, color: '#ed6c02' },
    { name: 'Held', value: data.heldNumbers, color: '#9c27b0' },
    { name: 'Quarantined', value: data.quarantinedNumbers, color: '#d32f2f' },
  ];

  return (
    <ResponsiveContainer width="100%" height="90%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InventoryPieChart;