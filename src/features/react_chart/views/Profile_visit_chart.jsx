import React, {useEffect, useState} from 'react'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {convertTimestampToDate} from "../../../utils/commonUtils";
import {RotatingLines} from "react-loader-spinner";

const ProfileVisitChart = ({graphData,socialMediaType}) => {
    const [data, setData] = useState([{day: 'Mon', uv: 4000}, {day: 'Tue', uv: 3000}, {day: 'Wed', uv: 2000}, {day: 'Thur', uv: 2780}, {day: 'Fri', uv: 1890}, {day: 'Sat', uv: 2390}, {day: 'Sun', uv: 3490},])

    useEffect(() => {
        if (graphData.data && !graphData.isLoading && !graphData?.isFetching && Array.isArray(graphData.data) && socialMediaType!==null && socialMediaType!==undefined) {
            switch(socialMediaType){
                case "FACEBOOK":
                case "INSTAGRAM":{
                    const dataSet = graphData.data.map((c => {
                        return {day: convertTimestampToDate(c?.end_time || new Date()), uv: c.value}
                    }))
                    setData(dataSet);
                    break;
                }
                case "LINKEDIN":{
                    const dataSet = graphData.data.map((c => {
                        return {day: convertTimestampToDate(c?.timeRange?.start || new Date()), uv: c?.totalPageStatistics?.views?.allPageViews?.pageViews}
                    }))
                    setData(dataSet);
                    break;
                }
            }

        }
    }, [graphData,socialMediaType]);


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
                        borderRight: " 15px solid transparent",
                        borderTop: "15px solid #E9E9E9"
                    }}>

                    </div>
                    <p style={{color: "#263238", fontSize: "12px"}}>{`${label} : ${dataItem.uv}`}</p>
                </div>
            );
        }
        return null;
    };
    return (
        (graphData?.isLoading || graphData?.isFetching)  ?
            <div className="d-flex justify-content-center profile-visit-graph ">
                <RotatingLines
                    strokeColor="#F07C33"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="70"
                    visible={true}
                />
            </div> : <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="day"
                           tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
                    <YAxis tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Area type="monotone" dataKey="uv" stroke="#009FFC" fill="#D9F1FF"/>
                </AreaChart>
            </ResponsiveContainer>

    )
}

export default ProfileVisitChart
