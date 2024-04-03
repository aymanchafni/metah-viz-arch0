import React, {useState, useEfect} from 'react'
import api from './api'
import axios from 'axios';
import Chart from 'chart.js/auto';

const App = () => {

    const config = {
        type: 'line',
        data: {
            labels: Array(30).fill("0000-00-00 00:00:00"),
            datasets: [{
                label: "Random Dataset",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: Array(30).fill(null),
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
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
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
        if (config.data.labels.length === 30) {
            config.data.labels.shift();
            config.data.datasets[0].data.shift();
        }
        config.data.labels.push(data.time);
        config.data.datasets[0].data.push(data.value);
        lineChart.update();
    }









}


export default App;
