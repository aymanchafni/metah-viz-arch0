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
                const x = x4[j];
                // We get the dataset's function and calculate the value
                var fct = data.datasets[0].function,
                    //affect x1 to data.labels
                    
                    y = fct([x1[j],x2[j],x3[j],x]);
                // Then we add the value to the dataset data
                data.labels.push(x)
                data.datasets[0].data.push(y);
                
            }
        
            
        }
    }; 

    const RGB_Linear_Shade=(p,c)=>{
        var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:255*p,P=P?1+p:1-p;
        return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
    };

    const RGB_Log_Shade=(p,c)=>{
        var i=parseInt,r=Math.round,[a,b,c,d]=c.split(","),P=p<0,t=P?0:p*255**2,P=P?1+p:1-p;
        return"rgb"+(d?"a(":"(")+r((P*i(a[3]=="a"?a.slice(5):a.slice(4))**2+t)**0.5)+","+r((P*i(b)**2+t)**0.5)+","+r((P*i(c)**2+t)**0.5)+(d?","+d:")");
    };

    const generate_point_colors = (method, numberPt, startColor) =>{

        var colors = [];
        var c = startColor;
        var p = 1/numberPt;
        for(let i = 0; i < numberPt; i++){
            colors.push(c);
            c = method(p,c)

        }

        colors.reverse();

        return colors;

    };

    const pointBackgroundColors =generate_point_colors(RGB_Log_Shade,100,"rgb(0, 255, 0)");
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
                            //backgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: pointBackgroundColors,
                            pointBackgroundColor: pointBackgroundColors,
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
                    display: false,
                    scaleLabel: {
                        display: false,
                        labelString: 'X1'
                    }
                }],
                yAxes: [{
                    display: false,
                    max: 2000000,
                    scaleLabel: {
                        display: false,
                        labelString: 'Score'
                    }
                }],
                
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
        
        config.data.labels.splice(99,0,data.x[3]);
        config.data.datasets[1].data.splice(99,0,data.fx);
        config.data.datasets[0].data.splice(99,0,null);

    

        lineChart.update();
    }; 




   return(
     <div></div>
   )




}


export default App;
