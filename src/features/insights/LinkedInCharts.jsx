import React, {useEffect, useState} from 'react';
import {BarChart, Bar, XAxis, PieChart, Cell, Pie, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const LinkedInStaffCountRangeChart = ({graphData}) => {
    const [data, setData] = useState([]);
    const totalValue = data.reduce((total, entry) => total + entry.organicFollowerCounts, 0);
    const customTooltipContent = ({label, payload}) => {
        if (payload && payload.length > 0) {
            const currentData = payload[0];
            return (
                <div className="custom-tooltip hr-graph-tooltip ">
                    <p>{`Staff Count Range: ${label}`}</p>
                    <p className={"percentage-value-hr-graph"}>{`Audience Count: ${currentData.payload.organicFollowerCounts}`}</p>
                    <p className={"percentage-value-hr-graph"}>{`Audience Percentage: ${currentData.value}%`}</p>
                </div>
            );
        }
        return null;
    };
    const dataWithPercentage = data.map(entry => ({
        ...entry,
        percentage: (entry.organicFollowerCounts / totalValue) * 100,
    }));
    useEffect(() => {
        if (graphData !== null && graphData !== undefined) {
            const totalValue = graphData.reduce((total, entry) => total + entry.organicFollowerCounts, 0);

            const dataWithPercentage = graphData.map(entry => ({
                ...entry,
                value: ((entry.organicFollowerCounts / totalValue) * 100).toFixed(2)
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
                <YAxis dataKey="label" type="category"/>
                <Tooltip content={customTooltipContent}/>
                <Legend/>
                <Bar dataKey="value" fill="#F07C33"/>
            </BarChart>
        </ResponsiveContainer>
    );
};

const LinkedInIndustryAudienceChart = ({graphData}) => {
    const [data, setData] = useState([]);
    const COLORS = ['#F07C33', '#ff7fb7', '#ce3662'];
    useEffect(() => {
        if (graphData !== null && graphData !== undefined) {
            setData(graphData)
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
                                return <li className={"legend-list-item"} key={"industry" + index}>
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

export {LinkedInStaffCountRangeChart, LinkedInIndustryAudienceChart};
