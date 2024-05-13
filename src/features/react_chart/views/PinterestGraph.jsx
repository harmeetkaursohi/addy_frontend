import React, { useState } from 'react'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
const PinterestGraph = () => {
    const [data, setData] = useState([{day: '21april', uv: 4000}, {day: '22april', uv: 3000}, {day: '23april', uv: 2000}, {day: '24april', uv: 2780}, {day: '25april', uv: 1890}, {day: '26april', uv: 2390}, {day: '27april', uv: 3490},])

  return (
    <ResponsiveContainer width="100%" height={270}>
    <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="day"
               tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
        <YAxis tick={{fill: '#263238', fontSize: 13, fontWeight: '900', fontFamily: 'Nunito'}}/>
      
  
        <Area type="monotone" dataKey="uv" stroke="#F07D34" fill="#fdebe1"/>
    </AreaChart>
</ResponsiveContainer>
  )
}


export default PinterestGraph