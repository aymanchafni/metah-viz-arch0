import React from 'react';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  plugins,
} from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { RGB_Log_Shade, generate_point_colors} from '../style/functions'
import { quickSort } from '../utils/utils';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  plugins,
  //zoomPlugin
);

const FxChart = ({fx, dim, data}) => {


   

    const decimation = {
        enabled: true,
        algorithm: 'lttb',
        samples:50
      };

    const options = {
         // Turn off animations and data parsing for performance
         animation: false,
         //parsing: false,
         responsive: true,
         title: {
             display: true,
             text: 'Creating Real-Time Charts with FastAPI'
         },
         tooltips: {
             mode: 'index',
             intersect: false,
         },
         hover: {
             mode: 'nearest',
             intersect: true
         },
         interaction: {
             mode: 'nearest',
             axis: 'x',
             intersect: false
           },
         scales: {
             x: {
                 type: 'linear',
                 title: {
                     display: true,
                     text: 'X'+dim
                 },
                 
             },
             y: {
                 type: 'logarithmic',

                 title: {
                     display: true,
                     text: 'Score'
                 }
             },
             
         },
         elements:{
             point:{
                 radius : 1,
             },
             line:{
                 borderWidth:0.5,
                 borderJoinStyle:'round'
             }
         },
        
         plugins: {
             decimation: decimation,
             zoom: {
               zoom: {
                 wheel: {
                   enabled: true,
                 },
                 pinch: {
                   enabled: true
                 },
                 mode: 'xy',
               }
             }
           }
     };
  

    

    return (
        <div>
            <Chart data={data} options={options} />
        </div>
        
    )
};
 

export default FxChart;
