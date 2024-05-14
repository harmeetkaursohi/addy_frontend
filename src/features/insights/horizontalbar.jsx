// // BarChartComponent.js
// import React, {useEffect, useState} from 'react';
// import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';


// // const  CustomizedAxisTick = ({ x, y, payload }) => (
// //   <g transform={`translate(${x},${y})`}>
// //     <text x={0} y={0} dy={16}  fill="#666" transform="rotate(-180)">
// //       {payload.value}
// //     </text>
// //   </g>
// // );
// const HorizontalBarChart = ({graphData}) => {
//     const [data, setData] = useState([
//         {age_range: '18-24', value: 10},
//         {age_range: '25-34', value: 40},
//         {age_range: '35-44', value: 80},
//         {age_range: '45-54', value: 7.1},
//         {age_range: '55+', value: 100},
//     ]);
//     const totalValue = data.reduce((total, entry) => total + entry.value, 0);
//     const customTooltipContent = ({ label, payload }) => {
//         if (payload && payload.length > 0) {
//             const currentData = payload[0];
//             return (
//                 <div className="custom-tooltip hr-graph-tooltip ">
//                     <p>{`Age Range: ${label}`}</p>
//                     <p className={"percentage-value-hr-graph"}>{`Value: ${currentData.value}%`}</p>
//                 </div>
//             );
//         }
//         return null;
//     };

// // Calculate percentage values
//     const dataWithPercentage = data.map(entry => ({
//         ...entry,
//         percentage: (entry.value / totalValue) * 100,
//     }));
//     useEffect(() => {
//         if (graphData !== null && graphData !== undefined) {
//             const totalValue = graphData.reduce((total, entry) => total + entry.value, 0);

//             const dataWithPercentage = graphData.map(entry => ({
//                 ...entry,
//                 value: ((entry.value / totalValue) * 100).toFixed(2)
//             }));
//             setData(dataWithPercentage)
//         }
//     }, [graphData])
//     return (
//         <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//                 layout="vertical"
//                 data={dataWithPercentage}
//                 margin={{top: 20, right: 30, left: 20, bottom: 5}}
//             >
//                 <XAxis type="number" domain={[0, 100]} tickFormatter={value => `${value}%`} textAnchor={"start"}
//                        position="right" angle={0}/>
//                 <YAxis dataKey="age_range" type="category"/>
//                 <Tooltip content={customTooltipContent} />
//                 <Legend/>
//                 <Bar dataKey="value" fill="#F07C33"/>
//             </BarChart>
//         </ResponsiveContainer>
//     );
// };

// export default HorizontalBarChart;


// BarChartComponent.js
import React, { useEffect, useState } from 'react';
import "./Chart.css"
import {BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const data = [
    {
        name: '21, april',
        Reaction: 4000,
        Comment: 2400,
        Share: 2400,
    },
    {
        name: '22, april',
        Reaction: 3000,
        Comment: 1398,
        Share: 2210,
    },
    {
        name: '23, april',
        Reaction: 2000,
        Comment: 9800,
        Share: 2290,
    },
    {
        name: '24, april',
        Reaction: 2780,
        Comment: 3908,
        Share: 2000,
    },
    {
        name: '25, april',
        Reaction: 1890,
        Comment: 4800,
        Share: 2181,
    },
    {
        name: '26, april',
        Reaction: 2390,
        Comment: 3800,
        Share: 2500,
    },
    {
        name: '27, april',
        Reaction: 3490,
        Comment: 4300,
        Share: 2100,
    },
];



const HorizontalBarChart = ({postInteractiondata,socialMediaType}) => {

    const [align,setAlign]=useState(false)

const convertDate =(date)=>{
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    const formattedDate = `${month} ${day} ${year}`
    return formattedDate
}




   const  engagementData =  postInteractiondata?.data?.map((data)=>{
      return(
          data?.values?.map(entry => ({
  
                  date: convertDate(new Date(entry.end_time)) , 
                  POSTENGAGED: entry.value 
                }))
              
        
      )
  
    });



     const pinterestPostEngageData=  postInteractiondata?.length>0 && postInteractiondata?.map(entry => ({

                date: entry.date , 
                POSTENGAGED: entry?.metrics?.ENGAGEMENT 
              }))
            

 


useEffect(()=>{
    const handleResize=()=>{
    if(window.innerWidth<=767){
        setAlign(true)
    }else{
        setAlign(false)
    }
    }
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    };
},[])
    return (

        <ResponsiveContainer width="100%" height={300}>
            <CartesianGrid strokeDasharray="3 3"/>
            <BarChart
                width={500}
                height={300}

         
                data={engagementData!==undefined && socialMediaType==="FACEBOOK"? engagementData[0]:pinterestPostEngageData}
                margin={{
                    top: 20,
                    right: 20,
                    left: 5,
                    bottom: 20,
                }}
            >
              
               
                <XAxis dataKey="date" tick={{fill: '#263238', fontSize: 13, fontWeight: 'bold', fontFamily: 'Nunito'}}/>
                <YAxis tick={{fill: '#263238', fontSize: 13, fontWeight: 'bold', fontFamily: 'Nunito'}}/>
                <Tooltip cursor={{fill: 'none'}}/>
                <Legend layout="horizontal" align={"left"} verticalAlign={"top"}/>

                <Bar dataKey="POSTENGAGED" fill="#E05905" barSize={20}/>
               
            
            </BarChart>
        </ResponsiveContainer>

    )
}

export default HorizontalBarChart
 





