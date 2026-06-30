"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface CompletionChartProps {
  data: Array<{ day: string; completed: number }>;
  barColor?: string;
}

export const CompletionChart: React.FC<CompletionChartProps> = ({ data, barColor = '#6366f1' }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
        <Tooltip 
          contentStyle={{ background: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        />
        <Bar dataKey="completed" fill={barColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CompletionChart;
