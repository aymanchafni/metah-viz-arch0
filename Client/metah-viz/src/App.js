import React, {useState, useEfect,useRef} from 'react'
import api from './api'
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart, { plugins } from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

const App = () => {

    var fx = (x) => { return 1.7781*0.625*x[1]*x[2]**2 + 0.6224*0.625*x[0]*x[2]*x[3] + 3.1661*(0.625*x[0])**2*x[3] + 19.84*(0.625*x[0])**2*x[2]
    };


   
    Chart.register(zoomPlugin);

    const plugin1 = {
       // id: "cc",
        beforeInit: function(chart) {
        
            // We get the chart data
            var data = chart.config.data;
            
            //create function vars
            let x1 = Array.from({length: 1000}, () => Math.random() * 300);
            let x2 = Array.from({length: 1000}, () => Math.random() * 300);
            let x3 = Array.from({length: 1000}, () => Math.random() * 300);
            let x4 = Array.from({length: 1000}, () => Math.random() * 300);


                
                // For every label ...
            for (var j = 0; j < x1.length; j++) {
                const x = x1[j];
                // We get the dataset's function and calculate the value
                var fct = data.datasets[0].function,
                    //affect x1 to data.labels
                    
                    y = fct([x,x2[j],x3[j],x4[j]]);
                // Then we add the value to the dataset data
                data.labels.push(x)
                data.datasets[0].data.push(y);
                
            }
        
        }
    }; 

    const config = {
        
        plugins: [plugin1],
        data: {
            labels: Array(100).fill(null),
            datasets: [
                       {
                       type: 'scatter',
                          label: "f(x)",
                          function: function(x) { return fx(x) },
                          data: Array(100).fill(null),
                          backgroundColor: 'rgb(1, 1, 1)',
                          borderColor: "rgba(1, 1, 1)",
                          fill: false,
                          order:2
                        }, 
                       { 
                        type: 'scatter',
                            label: "Metaheuristic",
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: Array(1100).fill(null),
                            fill: false,
                            order:1
                            
                        } 
            
        
        
        ],
        },
        options: {
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
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'X1'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Score'
                    }
                }]
            },
            plugins: {
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
        }
    };


    
    const context = document.getElementById("canvas");

    /*const oldChart  = Chart.getChart(context);
    if (oldChart) {oldChart.destroy()}; */

    var lineChart = new Chart(context, config);

   


    const source = new EventSource("http://localhost:8000/chart-data");
    //api.EventSource = new EventSource("/chart-data");
    //source = api.EventSource;

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);
      
          if (config.data.labels.length === 1100) {
            config.data.labels.shift();
            config.data.datasets[1].data.shift();
            config.data.datasets[0].data.shift();

        } 
        
        config.data.labels.splice(99,0,data.x[0]);
        config.data.datasets[1].data.splice(99,0,data.fx);
        config.data.datasets[0].data.splice(99,0,null);

    

        lineChart.update();
    }; 




   return(
     <div></div>
   )




}


export default App;
