import React, {useState, useEfect,useRef} from 'react'
import FxChart from './components/fxchart';

const App = () => {

    const fx = (x) => { return 1.7781*0.625*x[1]*x[2]**2 + 0.6224*0.625*x[0]*x[2]*x[3] + 3.1661*(0.625*x[0])**2*x[3] + 19.84*(0.625*x[0])**2*x[2]
    };

    
   

   
  
    return (
      <frameElement rows="250px, 250px" cols="250px, 250px">
          <frameElement>
              <FxChart
                    fx={fx} 
                    dim={0} 
                      
              />
          </frameElement>

          <frameElement>
              <FxChart
                        fx={fx} 
                        dim={1} 
                  />
          </frameElement>

          <frameElement>
              <FxChart
                        fx={fx} 
                        dim={2} 
                  />
          </frameElement>

          <frameElement>
              <FxChart
                        fx={fx} 
                        dim={3} 
                  />
          </frameElement>
      
      </frameElement>
  
  );



}


export default App;
