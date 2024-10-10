// BarChartComponent.js
import React, {useEffect, useState} from 'react';
import "./Chart.css"
import {BarChart, Bar,  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {getFormattedDataForPostEngagementGraph} from "../../utils/dataFormatterUtils";

const HorizontalBarChart = ({graphData,  socialMediaType}) => {

    const [data, setData] = useState();

    useEffect(() => {
        if (graphData) {
            const data = getFormattedDataForPostEngagementGraph(graphData, socialMediaType)
            setData(data)
        }
    }, [graphData])

    return (
        <ResponsiveContainer width="100%" height={300}>
            <CartesianGrid strokeDasharray="3 3"/>
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 20,
                    left: 5,
                    bottom: 20,
                }}
            >
                <XAxis dataKey="date" tick={{fill: '#263238', fontSize: 13, fontWeight: 'bold', fontFamily: 'Nunito'}}/>
                <YAxis tick={{fill: '#263238', fontSize: 13, fontWeight: 'bold', fontFamily: 'Nunito'}}/>
                <Tooltip cursor={{fill: 'none'}}/>
                <Legend layout="horizontal" align={"left"} verticalAlign={"top"}/>
                <Bar dataKey="POST ENGAGEMENT" fill="#E05905" barSize={20}/>
            </BarChart>
        </ResponsiveContainer>

    )
}

export default HorizontalBarChart
 





