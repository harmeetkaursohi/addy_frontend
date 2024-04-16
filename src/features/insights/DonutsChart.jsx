// // DonutChart.js
// import React, {useEffect, useState} from 'react';
// import {ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip} from 'recharts';
// import "./Chart.css"


// const DonutChart = ({graphData}) => {
//     const [data, setData] = useState([
//         {name: 'Men', value: 0},
//         {name: 'Women', value: 0},
//         {name: 'Non-binary/Unspecified', value: 0},

//     ]);

//     const COLORS = ['#F07C33', '#ff7fb7', '#ce3662'];
//     useEffect(() => {
//         if (graphData !== null && graphData !== undefined) {
//             setData([
//                     {name: 'Men', value: graphData?.filter(data => data?.gender === "M")[0]?.value},
//                     {name: 'Women', value: graphData?.filter(data => data?.gender === "F")[0]?.value},
//                     {name: 'Non-binary/Unspecified', value: graphData?.filter(data => data?.gender === "U")[0]?.value},
//                 ]
//             )
//         }
//     }, [graphData])

//     return (
//         <div className='donutChart_outer'>

//             <ResponsiveContainer width="100%" height={400}>
//                 <PieChart>
//                     <Pie
//                         data={data}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius="60%"
//                         outerRadius="80%"
//                         fill="#8884d8"
//                         // paddingAngle={5}
//                         dataKey="value"


//                         // label={({cx, cy, midAngle, innerRadius, outerRadius, value, index}) => {
//                         //     const RADIAN = Math.PI / 180;
//                         //     const radius = 25 + innerRadius + (outerRadius - innerRadius);
//                         //     const angle = midAngle * RADIAN;
//                         //     const x = cx + radius * Math.cos(-angle);
//                         //     const y = cy + radius * Math.sin(-angle);
//                         //
//                         //     // Adjust text position based on the side of the chart
//                         //     const textAnchor = "middle";
//                         //     const xOffset = 0;
//                         //
//                         //     return (
//                         //         <text
//                         //             x={x + xOffset}
//                         //             y={y}
//                         //             fill="white"
//                         //             textAnchor={textAnchor}
//                         //             dominantBaseline="central"
//                         //         >
//                         //             {data[index].name}
//                         //         </text>
//                         //     );
//                         // }}
//                     >

//                         {data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
//                         ))}


//                     </Pie>
//                     <Tooltip/>
//                     <Legend content={<ul>
//                         {
//                             data?.map((cur, index) => {
//                                 const total = data[0]?.value + data[1]?.value + data[2]?.value
//                                 return <li className={"legend-list-item"}>
//                                     <div style={{color: COLORS[index]}}>{cur?.name}-</div>
//                                     <div className={"pie-percentage"}>{((cur?.value / total) * 100)?.toFixed(2)} %</div>
//                                 </li>
//                             })
//                         }

//                     </ul>} verticalAlign="middle" align='right' layout="vertical"/>
//                 </PieChart>
//             </ResponsiveContainer>
//         </div>
//     );
// };

// export default DonutChart;


// new code dounuts
import React, {useEffect, useState} from 'react'
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import "./Chart.css"
import {RotatingLines} from "react-loader-spinner";
import {Country} from 'country-state-city';

const DonutsChart = ({chartData = null}) => {
    const COLORS = ['#E05905', '#62C2F9', '#00A3FF'];
    const [data, setData] = useState([
        {name: 'India', value: 70},
        {name: 'USA', value: 12},
        {name: 'Others', value: 18},]
    );


    useEffect(() => {
        if (chartData?.data?.country !== null && chartData?.data?.country !== undefined) {
            const formattedData=getFormattedData([...chartData?.data?.country])
            setData([
                    {name: Country.getCountryByCode(formattedData.highest.country_code).name, value: formattedData.highest.value},
                    {name: Country.getCountryByCode(formattedData.secondHighest.country_code).name, value: formattedData.secondHighest.value},
                    {name: 'Others', value: formattedData.rest.value},
                ]
            )
        }
    }, [chartData])

    const getFormattedData = (data) => {
        let sortedData = data.sort((a, b) => b.value - a.value);
        return {highest: sortedData[0], secondHighest: sortedData[1], rest: sortedData.slice(2).reduce((sum, item) => sum + item.value, 0)};
    }

    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + Math.cos(-midAngle * (Math.PI / 180)) * radius;
        const y = cy + Math.sin(-midAngle * (Math.PI / 180)) * radius;
        return (
            <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };


    return (
        chartData?.loading ? <div className="d-flex justify-content-center profile-visit-graph ">
                <RotatingLines
                    strokeColor="#F07C33"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="70"
                    visible={true}
                />
            </div> :
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        innerRadius={40} // Set inner radius to create the donut effect
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                        ))}
                    </Pie>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
    )
}


export default DonutsChart