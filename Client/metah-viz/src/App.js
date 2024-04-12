import React, {useState, useEfect} from 'react'
import api from './api'
import axios from 'axios';
import Chart from 'chart.js/auto';

const App = () => {

    const config = {
        type: 'scatter',
        data: {
            labels: Array(100).fill(null),
            datasets: [{
                label: "Random Dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: Array(100).fill(null),
                fill: false,
            }],
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
            }
        }
    };

    const context = document.getElementById("canvas");
    
    const lineChart = new Chart(context, config);
  
    const source = new EventSource("http://localhost:8000/chart-data");
    //api.EventSource = new EventSource("/chart-data");
    //source = api.EventSource;

    source.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (config.data.labels.length === 100) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
        }
        config.data.labels.push(data.x[1]);
        config.data.datasets[0].data.push(data.fx);
        lineChart.update();
    }




   return(
     <div></div>
   )




}


export default App;
