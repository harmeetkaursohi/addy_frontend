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

    const [dataSet, setDataSet] = useState([
        {
            label: 'Account Reached', data: [0, 0, 0, 0, 0, 0],
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)'
        },
        {
            label: 'Followers',
            data: [0, 0, 0, 0, 0, 0],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],)

    const [data, setData] = useState({labels, datasets: dataSet});


    const options = {
        responsive: true,
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
        if (reportData?.data && Array.isArray(reportData.data?.Followers)) {
            setLabels(computeLabels(reportData?.data.Followers));

            // Extract the percentage growth values and update dataSet
            dataSet[0].data = reportData?.data.Accounts_Reached.map((entry) => entry.percentageGrowth);
            dataSet[1].data = reportData?.data.Followers.map((entry) => entry.percentageGrowth);

            setDataSet([...dataSet]);

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
