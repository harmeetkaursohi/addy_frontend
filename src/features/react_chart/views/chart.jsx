import { AreaChart, LineChart,Area,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './chart.css'
const Chart=()=>{
    const data = [
        { name: 'Mon', value: 100, name: 'Mon', value1: 100 },
        { name: 'Tue', value: 75 , value1: 50 },
        { name: 'Wed', value: 25, value1: 200  },
        { name: 'Thur', value: 60 ,value1: 10}   ,
        { name: 'Fri', value: 140,  value1: 270  },
        { name: 'Sat', value: 150 , value1: 130  },
        { name: 'Sun', value: 200  ,value1: 100  },
    
      ];
      
    return(
        <>
        {/* <AreaChart width={600} height={400} data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8" />
    </AreaChart> */}
    <LineChart  data={data} className='line_chart' height={400} width={600} >
    <XAxis dataKey="name"/>
    <YAxis/>
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
    <Line type="monotone" dataKey="value1" stroke="#8884d8" activeDot={{ r: 7 }} />
  </LineChart>
        </>
    )
}
export default Chart