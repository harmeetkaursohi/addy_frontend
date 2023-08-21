import { AreaChart, LineChart,Area,Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './chart.css'
const Chart=()=>{
    const data = [
        { name: 'Mon', value: 15,  value1: 20 ,amt:100},
        { name: 'Tue', value: 35 , value1: 30 ,amt:75},
        { name: 'Wed', value: 30, value1: 30 ,amt:25 },
        { name: 'Thu', value: 40 ,value1: 20 ,amt:0}   ,
        { name: 'Fri', value: 20,  value1: 50 ,amt:0 },
        { name: 'Sat', value: 25 , value1: 23 ,amt:0 },
        { name: 'Sun', value: 10  ,value1: 40 ,amt:0 },
    
      ];
      
    return(
        <>
        <div  >

    <AreaChart  data={data} className='line_chart' height={400} width={500} >
    <XAxis dataKey="name" tick={{ fill: '#5F6D7E', fontSize: 13 }}/>
    <YAxis  dataKey="amt" tick={{ fill: '#5F6D7E', fontSize: 13 }}/>
    <CartesianGrid stroke="#eee" strokeDasharray="2 2"/>
    {/* <Line type="monotone" dataKey="value" stroke="#05A2FB" activeDot={{ r: 0 }} />
    <Line type="monotone" dataKey="value1" stroke="#F07C33" activeDot={{ r: 7 }} /> */}
    <Area type="monotone" dataKey="value" stackId="1" stroke="#05A2FB" fill="#98d2f3"/>
    <Area type="monotone" dataKey="value1" stackId="2" stroke="#F07C33" fill='transparent'/>
  </AreaChart>
        </div>
        </>
    )
}
export default Chart