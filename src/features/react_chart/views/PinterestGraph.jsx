import React, {useEffect, useState} from 'react'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {RotatingLines} from "react-loader-spinner";
import {isNullOrEmpty} from "../../../utils/commonUtils";

const PinterestGraph = ({graphData, isLoading}) => {

    const [data,setData]=useState([]);

    useEffect(()=>{
        if(!isNullOrEmpty(graphData) && !isLoading){
            const readyData=graphData?.all?.daily_metrics?.filter(cur=>cur.data_status==="READY")
            const data=readyData?.map((entry)=>{
                return {
                    day: entry.date,
                    "PIN CLICK":entry?.metrics?.PIN_CLICK
                }
            })
            setData(data)
        }
    },[graphData])

    return (
        isLoading ?
            <div className="d-flex justify-content-center profile-visit-graph ">
                <RotatingLines
                    strokeColor="#F07C33"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="70"
                    visible={true}
                />
            </div> :
            <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <XAxis dataKey="day"
                           tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
                    <YAxis tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
                    <Area type="monotone" dataKey="PIN CLICK" stroke="#F07D34" fill="#fdebe1"/>
                </AreaChart>
            </ResponsiveContainer>
    )
}


export default PinterestGraph