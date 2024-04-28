import React, {useState, useEfect,useRef} from 'react'
import FxChart from './components/fxchart';
import { generate_point_colors, RGB_Log_Shade } from './style/functions';
import { quickSort } from './utils/utils';

const App = () => {

    const fx = (x) => { return 1.7781*0.625*x[1]*x[2]**2 + 0.6224*0.625*x[0]*x[2]*x[3] + 3.1661*(0.625*x[0])**2*x[3] + 19.84*(0.625*x[0])**2*x[2]
    };

    const pointBackgroundColors =generate_point_colors(RGB_Log_Shade,101,"rgb(0, 255, 0)");

    
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

            
             let initialData4 = {};
             //create function vars
             const _x = Array.from({length: len0}, () => new Array(3).fill(Math.random() * 300));

             let xDim = Array.from({length: len0}, () => Math.random() * 300);

             xDim = quickSort(xDim);

             for(let dim=0;dim<4;dim++){

                    let data = structuredClone(initialData);
                    const x = _x.map((elem,index) => {
                        let elemCp = [...elem];
                        elemCp.splice(dim,0,xDim[index]);
                        return elemCp;
                    });
        
                        // For every label ...
                    for (let j = 0; j < len0; j++) {
          
                        data.labels.push(xDim[j]);
                        data.datasets[0].data.push(fct(x[j]));
                        
                    };
                    initialData4[dim] = data;
                    

             }

 
             
             return initialData4;
             
         };
     
    const initialData = initialize_data(fx,1000,101);

    const [currentData, setCurrentData] = useState(initialData);

 

    
    const source = new EventSource("http://localhost:8000/chart-data");

    source.onerror = (error) => {
        console.error('EventSource failed', error)
        source.close()
    }

    source.onmessage = function (event) {

            
      const newData = JSON.parse(event.data);

      setCurrentData((oldData) => {
        if(newData == null){
            
            return;
        };

        const updatedData = structuredClone(oldData);

        for(let dim=0;dim<4;dim++){

              updatedData[dim].labels.shift();
              updatedData[dim].datasets[1].data.shift();
              updatedData[dim].datasets[0].data.shift();

              updatedData[dim].labels.splice(99,0,newData.x[dim]);
              updatedData[dim].datasets[1].data.splice(99,0,newData.fx);
              updatedData[dim].datasets[0].data.splice(99,0,null);

              const min = updatedData[dim].datasets[1].data[100]; 
              if(newData.fx < min || min == null) {
                updatedData[dim].labels.splice(100,1,newData.x[dim]);
                updatedData[dim].datasets[1].data.splice(100,1,newData.fx);
              }

              const labels = updatedData[dim].labels.slice(101);

              let index = labels.length;
              for(let i=0; i<labels.length; i++){
                  if(labels[i] > newData.x[dim]){
                      index = i;
                      break;
                  };
              };
            
              updatedData[dim].labels.splice(101+index,0,newData.x[dim]);
              updatedData[dim].datasets[0].data.splice(101+index,0,newData.fx);
              updatedData[dim].datasets[1].data.push(null);
        }
        
                
        return updatedData;
    });

    }
    
   

   
  
    return (
            <div className="container-fluid">

              <div className="row row-cols-2">

                <div className="col">
                  <FxChart
                      fx={fx}
                      dim={0} 
                      data={currentData[0]}
                  />
                </div>

                <div className="col">
                  <FxChart
                      fx={fx}
                      dim={1} 
                      data={currentData[1]}
                  />
                </div>



                <div className="col">
                <FxChart
                      fx={fx}
                      dim={2}
                      data={currentData[2]}
                  />
                </div>

                <div className="col">
                <FxChart
                      fx={fx}
                      dim={3}
                      data={currentData[3]}
                  />
                </div>

                </div>

              

            </div>  
  );



}


export default App;
