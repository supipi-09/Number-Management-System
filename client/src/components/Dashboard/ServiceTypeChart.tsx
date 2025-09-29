import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { numbersAPI } from '../../services/api';

const ServiceTypeChart: React.FC = () => {
  const [data, setData] = useState([
    { serviceType: 'LTE', allocated: 150, available: 200 },
    { serviceType: 'IPTL', allocated: 120, available: 180 },
    { serviceType: 'FTTH/Copper', allocated: 80, available: 120 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await numbersAPI.getNumbers();
        if (response.success && response.data) {
          const serviceTypeData = response.data.reduce((acc, number) => {
            const existing = acc.find(item => item.serviceType === number.serviceType);
            if (existing) {
              existing.count += 1;
              if (number.status === 'Allocated') existing.allocated += 1;
              if (number.status === 'Available') existing.available += 1;
            } else {
              acc.push({
                serviceType: number.serviceType,
                count: 1,
                allocated: number.status === 'Allocated' ? 1 : 0,
                available: number.status === 'Available' ? 1 : 0,
              });
            }
            return acc;
          }, [] as Array<{ serviceType: string; count: number; allocated: number; available: number }>);
          
          setData(serviceTypeData);
        }
      } catch (error) {
        console.error('Error fetching service type data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="serviceType" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="allocated" fill="#1976d2" name="Allocated" />
        <Bar dataKey="available" fill="#2e7d32" name="Available" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ServiceTypeChart;