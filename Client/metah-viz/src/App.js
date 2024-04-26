import React, {useState, useEfect,useRef} from 'react'
import FxChart from './components/fxchart';

const App = () => {

    const fx = (x) => { return 1.7781*0.625*x[1]*x[2]**2 + 0.6224*0.625*x[0]*x[2]*x[3] + 3.1661*(0.625*x[0])**2*x[3] + 19.84*(0.625*x[0])**2*x[2]
    };

    
   

   
  
    return (
            <div className="container-fluid">

              <div className="row row-cols-2">

                <div className="col">
                  <FxChart
                      fx={fx}
                      dim={0}
                  />
                </div>

                <div className="col">
                  <FxChart
                      fx={fx}
                      dim={1}
                  />
                </div>



                <div className="col">
                <FxChart
                      fx={fx}
                      dim={2}
                  />
                </div>

                <div className="col">
                <FxChart
                      fx={fx}
                      dim={3}
                  />
                </div>

                </div>

              

            </div>  
  );



}


export default App;
