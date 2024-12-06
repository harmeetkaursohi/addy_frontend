import React, {useEffect, useState} from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import {convertTimestampToDate} from "../../../utils/commonUtils";
import GraphLoader from "../../common/components/GraphLoader";

const ProfileVisitChart = ({graphData, socialMediaType}) => {
    const [data, setData] = useState([
        {day: 'Mon', "Profile Visit": 4000},
        {day: 'Tue', "Profile Visit": 3000},
        {day: 'Wed', "Profile Visit": 2000},
        {day: 'Thur', "Profile Visit": 2780},
        {day: 'Fri', "Profile Visit": 1890},
        {day: 'Sat', "Profile Visit": 2390},
        {day: 'Sun', "Profile Visit": 3490},
    ]);

    useEffect(() => {
        if (graphData.data && !graphData.isLoading && !graphData?.isFetching && Array.isArray(graphData.data) && socialMediaType !== null && socialMediaType !== undefined) {
            switch (socialMediaType) {
                case "FACEBOOK":
                case "INSTAGRAM": {
                    const dataSet = graphData.data.map((c) => ({
                        day: convertTimestampToDate(c?.end_time || new Date()),
                        "Profile Visit": c.value
                    }));
                    setData(dataSet);
                    break;
                }
                case "LINKEDIN": {
                    const dataSet = graphData.data.map((c) => ({
                        day: convertTimestampToDate(c?.timeRange?.start || new Date()),
                        "Profile Visit": c?.totalPageStatistics?.views?.allPageViews?.pageViews || 0
                    }));
                    setData(dataSet);
                    break;
                }
                default:
                    break;
            }
        }
    }, [graphData, socialMediaType]);

    const CustomTooltip = ({active, payload, label}) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0].payload;
            return (
                <div className="custom-tooltip" style={{
                    width: "",
                    border: "1px solid #D9D9D9",
                    height: "40px",
                    backgroundColor: '#E9E9E9',
                    position: "relative",
                    top: -70,
                    left: -50,
                    padding: "10px",
                    borderRadius: "5px"
                }}>
                    <div className='triangle' style={{
                        width: "0",
                        position: "absolute",
                        top: "30px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        height: 0,
                        borderLeft: "15px solid transparent",
                        borderRight: "15px solid transparent",
                        borderTop: "15px solid #E9E9E9"
                    }} />
                    <p style={{color: "#263238", fontSize: "12px"}}>{`${label} : ${dataItem?.["Profile Visit"]}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={270}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="day"
                            tick={{
                                fill: '#263238',
                                fontSize: 13,
                                fontWeight: '900',
                                fontFamily: 'Nunito'
                            }}
                        />
                        <YAxis
                            tick={{
                                fill: '#263238',
                                fontSize: 13,
                                fontWeight: '900',
                                fontFamily: 'Nunito'
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="Profile Visit"
                            stroke="#f07c33"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                    </LineChart>
                </ResponsiveContainer>

                {(graphData?.isLoading || graphData?.isFetching) && <GraphLoader />}
            </div>
        </>
    );
};

export default ProfileVisitChart;
