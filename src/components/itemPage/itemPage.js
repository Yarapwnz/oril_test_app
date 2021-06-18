import React from 'react'
// import beer_coin from '../data/beer_coin';
import { Line } from 'react-chartjs-2'

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [12, 12, 3, 5, 2, 3,90],
      fill: true,
      backgroundColor: 'rgb(127,197, 252)',
      borderColor: 'blue',
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};


const LineChart = () => (
  <>
    <div className='header'>
      <h1 className='title'>Revenue</h1>
    </div>
    <Line data={data} options={options} />
  </>
);

export default LineChart;
