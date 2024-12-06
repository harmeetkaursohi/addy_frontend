import React, {useEffect, useState} from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Legend,
    Bar
} from 'recharts';
import {RotatingLines} from "react-loader-spinner";
import {isNullOrEmpty} from "../../../utils/commonUtils";
import GraphLoader from "../../common/components/GraphLoader";

const PinterestGraph = ({graphData, isLoading}) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        if (!isNullOrEmpty(graphData) && !isLoading) {
            const readyData = graphData?.all?.daily_metrics?.filter(cur => cur.data_status === "READY")
            const data = readyData?.map((entry) => {
                return {
                    day: entry.date,
                    "Pin Click": entry?.metrics?.PIN_CLICK
                }
            })
            setData(data)
        }
    }, [graphData])

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <XAxis dataKey="day"
                           tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
                    <YAxis tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
                    <Area type="monotone" dataKey="Pin Click" stroke="#F07D34" fill="#fdebe1"/>
                    <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                </AreaChart>
            </ResponsiveContainer>
            {
                isLoading &&
                <GraphLoader/>
            }
        </div>

    )
}


export default PinterestGraph