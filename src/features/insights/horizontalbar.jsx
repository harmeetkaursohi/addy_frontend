// BarChartComponent.js
import React, {useEffect, useState} from 'react';
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';


// const  CustomizedAxisTick = ({ x, y, payload }) => (
//   <g transform={`translate(${x},${y})`}>
//     <text x={0} y={0} dy={16}  fill="#666" transform="rotate(-180)">
//       {payload.value}
//     </text>
//   </g>
// );
const HorizontalBarChart = ({graphData}) => {
    const [data, setData] = useState([
        {age_range: '18-24', value: 10},
        {age_range: '25-34', value: 40},
        {age_range: '35-44', value: 80},
        {age_range: '45-54', value: 7.1},
        {age_range: '55+', value: 100},
    ]);
    const totalValue = data.reduce((total, entry) => total + entry.value, 0);
    const customTooltipContent = ({ label, payload }) => {
        if (payload && payload.length > 0) {
            const currentData = payload[0];
            return (
                <div className="custom-tooltip hr-graph-tooltip ">
                    <p>{`Age Range: ${label}`}</p>
                    <p className={"percentage-value-hr-graph"}>{`Value: ${currentData.value}%`}</p>
                </div>
            );
        }
        return null;
    };

// Calculate percentage values
    const dataWithPercentage = data.map(entry => ({
        ...entry,
        percentage: (entry.value / totalValue) * 100,
    }));
    useEffect(() => {
        if (graphData !== null && graphData !== undefined) {
            const totalValue = graphData.reduce((total, entry) => total + entry.value, 0);

            const dataWithPercentage = graphData.map(entry => ({
                ...entry,
                value: ((entry.value / totalValue) * 100).toFixed(2)
            }));
            setData(dataWithPercentage)
        }
    }, [graphData])
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                layout="vertical"
                data={dataWithPercentage}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
            >
                <XAxis type="number" domain={[0, 100]} tickFormatter={value => `${value}%`} textAnchor={"start"}
                       position="right" angle={0}/>
                <YAxis dataKey="age_range" type="category"/>
                <Tooltip content={customTooltipContent} />
                <Legend/>
                <Bar dataKey="value" fill="#F07C33"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default HorizontalBarChart;
