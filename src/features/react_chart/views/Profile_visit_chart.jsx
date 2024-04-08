// new code 
import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfileVisitChart = () => {
    
const data = [
    { name: 'Mon', uv: 4000, amt: 2400 },
    { name: 'Tue', uv: 3000, amt: 2210 },
    { name: 'Wed', uv: 2000, amt: 2290 },
    { name: 'Thur', uv: 2780, amt: 2000 },
    { name: 'Fri', uv: 1890, amt: 2181 },
    { name: 'Sat', uv: 2390, amt: 2500 },
    { name: 'Sun', uv: 3490, amt: 2100 },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{width:"",border:"1px solid #D9D9D9",height:"40px", backgroundColor: '#E9E9E9',position:"relative",top: -70, left: -50 ,padding:"10px",borderRadius:"5px"}}>
          <div className='triangle' style={{ width: "0",
          position:"absolute",
          top: "30px",
         left: "50%",
        transform: "translateX(-50%)",
        height: 0, 
        borderLeft: "15px solid transparent",
        borderRight:" 15px solid transparent",
        borderTop: "15px solid #E9E9E9"}}>

          </div>
          <p style={{color:"#263238",fontSize:"12px"}}>{`${label} : ${dataItem.uv}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
<ResponsiveContainer width="100%" height={270}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: '#263238' ,fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
        <YAxis tick={{ fill: '#263238' ,fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="uv" stroke="#009FFC" fill="#D9F1FF" />
       
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ProfileVisitChart