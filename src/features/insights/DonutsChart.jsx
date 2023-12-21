// DonutChart.js
import React, {useEffect, useState} from 'react';
import {ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip} from 'recharts';
import "./Chart.css"


const DonutChart = ({graphData}) => {
    const [data, setData] = useState([
        {name: 'Men', value: 0},
        {name: 'Women', value: 0},
        {name: 'Non-binary/Unspecified', value: 0},

    ]);

    const COLORS = ['#F07C33', '#ff7fb7', '#ce3662'];
    useEffect(() => {
        if (graphData !== null && graphData !== undefined) {
            setData([
                    {name: 'Men', value: graphData?.filter(data => data?.gender === "M")[0]?.value},
                    {name: 'Women', value: graphData?.filter(data => data?.gender === "F")[0]?.value},
                    {name: 'Non-binary/Unspecified', value: graphData?.filter(data => data?.gender === "U")[0]?.value},
                ]
            )
        }
    }, [graphData])

    return (
        <div className='donutChart_outer'>

            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        fill="#8884d8"
                        // paddingAngle={5}
                        dataKey="value"


                        // label={({cx, cy, midAngle, innerRadius, outerRadius, value, index}) => {
                        //     const RADIAN = Math.PI / 180;
                        //     const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        //     const angle = midAngle * RADIAN;
                        //     const x = cx + radius * Math.cos(-angle);
                        //     const y = cy + radius * Math.sin(-angle);
                        //
                        //     // Adjust text position based on the side of the chart
                        //     const textAnchor = "middle";
                        //     const xOffset = 0;
                        //
                        //     return (
                        //         <text
                        //             x={x + xOffset}
                        //             y={y}
                        //             fill="white"
                        //             textAnchor={textAnchor}
                        //             dominantBaseline="central"
                        //         >
                        //             {data[index].name}
                        //         </text>
                        //     );
                        // }}
                    >

                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}


                    </Pie>
                    <Tooltip/>
                    <Legend content={<ul>
                        {
                            data?.map((cur, index) => {
                                const total = data[0]?.value + data[1]?.value + data[2]?.value
                                return <li className={"legend-list-item"}>
                                    <div style={{color: COLORS[index]}}>{cur?.name}-</div>
                                    <div className={"pie-percentage"}>{((cur?.value / total) * 100)?.toFixed(2)} %</div>
                                </li>
                            })
                        }

                    </ul>} verticalAlign="middle" align='right' layout="vertical"/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonutChart;


