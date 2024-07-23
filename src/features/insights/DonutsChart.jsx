import React, {useEffect, useState} from 'react'
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts';
import "./Chart.css"
import {RotatingLines} from "react-loader-spinner";
import {Country} from 'country-state-city';

const DonutsChart = ({chartData = null, socialMediaType}) => {

    const COLORS = ['#E05905', '#62C2F9', '#00A3FF'];
    const [data, setData] = useState([
        {name: 'India', value: 70},
        {name: 'USA', value: 12},
        {name: 'Others', value: 18},]
    );

    useEffect(() => {
        if (chartData?.data?.country !== null && chartData?.data?.country !== undefined && socialMediaType !== null && socialMediaType !== undefined) {
            switch (socialMediaType) {
                case "FACEBOOK":
                case "INSTAGRAM": {
                    let sortedData = [...chartData?.data?.country].sort((a, b) => b.value - a.value);
                    setData([
                        {
                            name: Country.getCountryByCode(sortedData[0].country_code).name,
                            value: sortedData[0].value
                        },
                        {
                            name: Country.getCountryByCode(sortedData[1].country_code).name,
                            value: sortedData[1].value
                        },
                        {
                            name: 'Others',
                            value: sortedData.slice(2).reduce((total, {value}) => total + value, 0)
                        },]
                    )
                    break;
                }
                case "LINKEDIN":{
                    const groupedData = [...chartData?.data?.country].reduce((acc, obj) => {
                        const key = obj.country_name;
                        acc[key] = (acc[key] || 0) + obj.value;
                        return acc;
                    }, {});
                    const output = Object.entries(groupedData).map(([name, value]) => ({
                        name,
                        value
                    }));
                    setData(output)
                    break;
                }
            }

        }
    }, [chartData, socialMediaType])

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