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




