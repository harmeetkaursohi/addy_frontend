import {
    AreaChart,
    LineChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import './Chart.css'
import {getChartFormattedDataForInsights} from "../../../utils/commonUtils";
import CommonLoader from "../../common/components/CommonLoader";

const Chart = ({selectedPage,isLoading = true, graphData}) => {
    const data = getChartFormattedDataForInsights(graphData,selectedPage?.socialMediaType);
    return (

        isLoading ?
            <CommonLoader></CommonLoader> :
            <>
                <div className='rechart_container'>
                    <ResponsiveContainer height={300}>
                        <AreaChart data={data} className='line_chart'>
                            <XAxis dataKey="x_axis" tick={{fill: '#5F6D7E', fontSize: 13}}/>
                            <YAxis tickFormatter={(amt) => `${amt}%`} dataKey="amt"
                                   tick={{fill: '#5F6D7E', fontSize: 13}}/>
                            <CartesianGrid stroke="#eee" strokeDasharray="2 2"/>
                            {/* <Line type="monotone" dataKey="value" stroke="#05A2FB" activeDot={{ r: 0 }} />
    <Line type="monotone" dataKey="value1" stroke="#F07C33" activeDot={{ r: 7 }} /> */}
                            <Area type="monotone" dataKey="account_reach" stackId="1" stroke="#05A2FB" fill="#98d2f3"/>
                            <Area type="monotone" dataKey="followers" stackId="2" stroke="#F07C33" fill='transparent'/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </>
    )
}
export default Chart










//------------------------ New Code ---------------------------
// import React from 'react'
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
//
// const Chart = () => {
//
// const data = [
//     { name: 'Mon', uv: 4000, amt: 2400 },
//     { name: 'Tue', uv: 3000, amt: 2210 },
//     { name: 'Wed', uv: 2000, amt: 2290 },
//     { name: 'Thur', uv: 2780, amt: 2000 },
//     { name: 'Fri', uv: 1890, amt: 2181 },
//     { name: 'Sat', uv: 2390, amt: 2500 },
//     { name: 'Sun', uv: 3490, amt: 2100 },
//   ]
//   return (
// <ResponsiveContainer width="100%" height={300}>
//       <AreaChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" tick={{ fill: '#263238' ,fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
//         <YAxis tick={{ fill: '#263238' ,fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
//         <Tooltip />
//         <Area type="monotone" dataKey="uv" stroke="#009FFC" fill="#D9F1FF" />
//
//       </AreaChart>
//     </ResponsiveContainer>
//   )
// }
//
// export default Chart




