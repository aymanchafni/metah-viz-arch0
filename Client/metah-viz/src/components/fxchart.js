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
  zoomPlugin
);

const FxChart = ({fx}) => {


    const pointBackgroundColors =generate_point_colors(RGB_Log_Shade,100,"rgb(0, 255, 0)");

    
    const initialize_data = (fct,len0,len1) => {
        // id: "cc",
         
   
             // We get the chart data
             var initialData = {
                labels: Array(len1).fill(null),
                    datasets: [
                               {
                               type: 'line',
                                  label: "f(x)",
                                  data: Array(len1).fill(null),
                                  backgroundColor: 'rgb(1, 1, 1)',
                                  borderColor: "rgba(1, 1, 1)",
                                  fill: false,
                                  cubicInterpolationMode: 'monotone',
                                  tension: 0.4,
                                  order:2
                                }, 
                               { 
                                type: 'scatter',
                                    label: "Metaheuristic",
                                    //backgroundColor: 'rgb(255, 99, 132)',
                                    pointBorderColor: pointBackgroundColors,
                                    pointBackgroundColor: pointBackgroundColors,
                                    data: Array(len0 + len1).fill(null),
                                    fill: false,
                                    elements:{
                                        point:{
                                            radius : 3,
                                        }
                                    },
                                    order:1
                                    
                                } 
                
                ],
                };
             
             //create function vars
             let x1 = Array.from({length: len0}, () => Math.random() * 300);
             let x2 = Array.from({length: len0}, () => Math.random() * 300);
             let x3 = Array.from({length: len0}, () => Math.random() * 300);
             let x4 = Array.from({length: len0}, () => Math.random() * 300);
 
             //x1 = quickSort(x1);  
             //x2 = quickSort(x2);
             //x3 = quickSort(x3);
             x4 = quickSort(x4);
 
                 // For every label ...
             for (let j = 0; j < len0; j++) {
                 const x = x4[j];
                 // We get the dataset's function and calculate the value
                     //affect x1 to data.labels
                     
                 const y = fct([x1[j],x2[j],x3[j],x]);
                 // Then we add the value to the dataset data
                 initialData.labels.push(x);
                 initialData.datasets[0].data.push(y);
                 
             }
             
             return initialData;
             
         };
     
    const initialData = initialize_data(fx,1000,100);

    const [currentData, setCurrentData] = useState(initialData);


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
                     text: 'X1'
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
  




    /*    const update_chart_data = (oldData, newData) =>{

            if(newData == null){
                return;
            };

            const updatedData = structuredClone(oldData);
            
            updatedData.labels.shift();
            updatedData.datasets[1].data.shift();
            updatedData.datasets[0].data.shift();
    
            updatedData.labels.splice(99,0,newData.x[3]);
            updatedData.datasets[1].data.splice(99,0,newData.fx);
            updatedData.datasets[0].data.splice(99,0,null);
    
            const labels = updatedData.labels.slice(100);
    
            var index = labels.length;
            for(let i=0; i<labels.length; i++){
                if(labels[i] > newData.x[3]){
                    index = i;
                    break;
                };
            };
           
            updatedData.labels.splice(100+index,0,newData.x[3]);
            updatedData.datasets[0].data.splice(100+index,0,newData.fx);
            updatedData.datasets[1].data.push(null);
    
            setCurrentData(updatedData);
        };
    */
    
    const source = new EventSource("http://localhost:8000/chart-data");
    
   

        source.onmessage = function (event) {
            
            const newData = JSON.parse(event.data);
            
            setCurrentData((oldData) => {
                if(newData == null){
                    return;
                };
    
                const updatedData = structuredClone(oldData);
                
                updatedData.labels.shift();
                updatedData.datasets[1].data.shift();
                updatedData.datasets[0].data.shift();
        
                updatedData.labels.splice(99,0,newData.x[3]);
                updatedData.datasets[1].data.splice(99,0,newData.fx);
                updatedData.datasets[0].data.splice(99,0,null);
        
                const labels = updatedData.labels.slice(100);
        
                var index = labels.length;
                for(let i=0; i<labels.length; i++){
                    if(labels[i] > newData.x[3]){
                        index = i;
                        break;
                    };
                };
               
                updatedData.labels.splice(100+index,0,newData.x[3]);
                updatedData.datasets[0].data.splice(100+index,0,newData.fx);
                updatedData.datasets[1].data.push(null);
                return updatedData;
            });
            
     
        }; 


    

    

    return (
        <div>
            <Chart data={currentData} options={options} />
        </div>
        
    )
};
 

export default FxChart;