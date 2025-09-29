import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AllocationChart: React.FC = () => {
  const data = [
    { month: 'Jan', allocated: 120, released: 80, reserved: 45 },
    { month: 'Feb', allocated: 150, released: 90, reserved: 52 },
    { month: 'Mar', allocated: 180, released: 70, reserved: 48 },
    { month: 'Apr', allocated: 200, released: 85, reserved: 60 },
    { month: 'May', allocated: 240, released: 95, reserved: 65 },
    { month: 'Jun', allocated: 280, released: 110, reserved: 70 },
    { month: 'Jul', allocated: 320, released: 130, reserved: 75 },
    { month: 'Aug', allocated: 350, released: 140, reserved: 80 },
    { month: 'Sep', allocated: 380, released: 160, reserved: 85 },
    { month: 'Oct', allocated: 420, released: 180, reserved: 90 },
    { month: 'Nov', allocated: 450, released: 200, reserved: 95 },
    { month: 'Dec', allocated: 480, released: 220, reserved: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="allocated"
          stroke="#1976d2"
          strokeWidth={2}
          dot={{ fill: '#1976d2' }}
          name="Allocated"
        />
        <Line
          type="monotone"
          dataKey="released"
          stroke="#2e7d32"
          strokeWidth={2}
          dot={{ fill: '#2e7d32' }}
          name="Released"
        />
        <Line
          type="monotone"
          dataKey="reserved"
          stroke="#ed6c02"
          strokeWidth={2}
          dot={{ fill: '#ed6c02' }}
          name="Reserved"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AllocationChart;