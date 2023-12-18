// BarChartComponent.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { age: '18-24', value: 10 },
  { age: '25-34', value: 40 },
  { age: '35-44', value: 80 },
  { age: '45-54', value: 7.1 },
  { age: '55+', value: 100 },
];
const totalValue = data.reduce((total, entry) => total + entry.value, 0);

// Calculate percentage values
const dataWithPercentage = data.map(entry => ({
  ...entry,
  percentage: (entry.value / totalValue) * 100,
}));

// const  CustomizedAxisTick = ({ x, y, payload }) => (
//   <g transform={`translate(${x},${y})`}>
//     <text x={0} y={0} dy={16}  fill="#666" transform="rotate(-180)">
//       {payload.value}
//     </text>
//   </g>
// );
const HorizontalBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={dataWithPercentage}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" domain={[0, 100]} tickFormatter={value => `${value}%`} textAnchor={"start"}  position="right" angle={90} />
        <YAxis dataKey="age" type="category"/>
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#F07C33" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default HorizontalBarChart;
