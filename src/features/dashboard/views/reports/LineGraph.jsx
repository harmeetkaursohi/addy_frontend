import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useEffect, useState} from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export const LineGraph = ({reportData}) => {

    const [labels, setLabels] = useState(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
    const [dataSet, setDataSet] = useState([],)
    const [data, setData] = useState({labels, datasets: dataSet});
  
    const [aspectRatio, setAspectRatio] = useState(true);

    useEffect(() => {
      const handleResize = () => {
        if(window.innerWidth <= 767){
            setAspectRatio(false)
        }
       
      };
  
      window.addEventListener('resize', handleResize);
  
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const options = {
        responsive: true,
        maintainAspectRatio: aspectRatio,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, values) {
                        return value + "%";
                    },
                },
            },
        },
    };


    const computeLabels = (objArray) => {
        return objArray.map(curObj => curObj.endDate);
    }


    useEffect(() => {
        if (reportData?.data && Array.isArray(reportData.data?.Accounts_Reached)) {
            setLabels(computeLabels(reportData?.data.Accounts_Reached));
            let dataSets = []


            // Extract the percentage growth values and update dataSet
            if (reportData?.data.Accounts_Reached !== undefined) {
                dataSets.push({
                    label: 'Account Reached',
                    data: reportData?.data.Accounts_Reached.map((entry) => entry.percentageGrowth),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    tension: 0.4,
                    pointRadius: 4,
                })
            }
            if (reportData?.data.Followers !== undefined) {
                dataSets.push({
                        label: 'Followers',
                        data: reportData?.data.Followers.map((entry) => entry.percentageGrowth),
                        borderColor: 'rgb(240, 124, 51)',
                        backgroundColor: 'rgba(240, 124, 51, 0.5)',
                        tension: 0.4,
                        pointRadius: 4,
                    }
                )
            }

            setDataSet([...dataSets]);

        }
    }, [reportData]);

    useEffect(() => {
        if (dataSet) {
            setData({labels, datasets: dataSet})
        }
    }, [dataSet]);


    return (
        <Line options={options} data={data}/>
    )

}

// import { Line } from 'react-chartjs-2';

// import {
//         CategoryScale,
//         Chart as ChartJS,
    
//         LinearScale,
//         LineElement,
//         PointElement,
//         Title,
//         Tooltip,
//     } from 'chart.js';
// ChartJS.register(
//         CategoryScale,
//         LinearScale,
//         PointElement,
//         LineElement,
//         Title,
//         Tooltip,
      
//     );
    
// const data = {
//     labels: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
//     datasets: [
//       {
//         label: 'uv',
//         data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
//         borderColor: '#00A3FF',
//         fill: true,
//       },
     
//     ],
//   };
//   export const   LineGraph = () => {  


//     const options = {
//         responsive: true,
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     callback: function (value, index, values) {
//                         return value + "%";
//                     },
//                 },
//             },
//         },
//     };
 
//         return (
//             <Line data={data} options={options}/>
        
    
//     )
// }

 


 




    

