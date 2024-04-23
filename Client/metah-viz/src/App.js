import React, {useState, useEfect,useRef} from 'react'
import FxChart from './components/fxchart';

const App = () => {

    const fx = (x) => { return 1.7781*0.625*x[1]*x[2]**2 + 0.6224*0.625*x[0]*x[2]*x[3] + 3.1661*(0.625*x[0])**2*x[3] + 19.84*(0.625*x[0])**2*x[2]
    };

    
    //const [streamdata, setStreamData] = useState(null);
 



   
  
    return (
    
      <FxChart
              fx={fx} 
              //index={0} 
              //newData={streamdata}   
      />
  
  
  );



}


export default App;
