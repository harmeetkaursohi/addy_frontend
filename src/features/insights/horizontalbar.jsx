import React, {useEffect, useState} from 'react';
import "./Chart.css";
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
import {getFormattedDataForPostEngagementGraph} from "../../utils/dataFormatterUtils";
import GraphLoader from "../common/components/GraphLoader";

const InteractionsLineGraph = ({isLoading, graphData, socialMediaType}) => {
    const [data, setData] = useState();

    useEffect(() => {
        if (graphData) {
            const formattedData = getFormattedDataForPostEngagementGraph(graphData, socialMediaType);
            setData(formattedData);
        }
    }, [graphData, socialMediaType]);

    return (
        <>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={270}>
                    <LineChart
                        width={"100%"}
                        height={270}
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 5,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#263238', fontSize: 13, fontWeight: 'bold', fontFamily: 'Nunito' }}
                        />
                        <YAxis
                            tick={{ fill: '#263238', fontSize: 13, fontWeight: 'bold', fontFamily: 'Nunito' }}
                        />
                        <Tooltip cursor={{ stroke: 'none' }} />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                        <Line
                            type="monotone"
                            dataKey="Post Engagement"
                            stroke="#E05905"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {isLoading && <GraphLoader />}
            </div>
        </>
    );
};

export default InteractionsLineGraph;
