from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.requests import Request
from fastapi.responses import StreamingResponse
from starlette.responses import Response
import logging
import asyncio
import json
import random
import sys
from datetime import datetime
from typing import Iterator
import time
from metaheuristics.optimizer import Optimizer


logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

@app.get('/api')
async def check():
    return 'hello mf'

origins = ['http://localhost:3000', 'http://127.0.0.1:3000',
           'https://localhost:3000', 'https://127.0.0.1:3000'] 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[ "X-Experimental-Stream-Data"],
)



def generate_random_data() -> Iterator[str]:
    """
    Generates random value between 0 and 100

    :return: String containing current timestamp (YYYY-mm-dd HH:MM:SS) and randomly generated data.
    """
    #client_ip = request.client.host

    #logger.info("Client %s connected", client_ip)

    i= 0

    while True:
        json_data = json.dumps(
            {
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "value": random.random() * 100,
            }
        )
        yield f"data:{json_data}\n\n"
        time.sleep(1)
        i+=1

def fx(x):
            return 1.7781*0.625*x[1]*x[2]**2 + 0.6224*0.625*x[0]*x[2]*x[3] + 3.1661*(0.625*x[0])**2*x[3] + 19.84*(0.625*x[0])**2*x[2]


meta1 = Optimizer(fx,[],"random","monte",100,100)

async def generate_metaheuristic_points(metaheuristic: Optimizer) -> Iterator[str]:

    #client_ip = request.client.host

    #logger.info("Client %s connected", client_ip)

    curr_pt,best_pt = metaheuristic.iterate(10,[],[])

    while True:
        
        start_time = time.time()
        curr_pt,best_pt = metaheuristic.iterate(10,curr_pt,best_pt)

        best_pt_items= best_pt.tolist()

        json_data = json.dumps(
            {
                "x": best_pt_items,
                "fx": fx(best_pt),
            }
        )
        yield f"data:{json_data}\n\n"
        
        exec_time = time.time() - start_time
        if  exec_time < 2:
            await asyncio.sleep(2-exec_time)

    

@app.get("/api/random-data")
def random_data() -> StreamingResponse:
    response = StreamingResponse(generate_random_data(), media_type="text/event-stream")
    #response.headers["Cache-Control"] = "no-cache"
    #response.headers["X-Accel-Buffering"] = "no"
    response.headers['Content-Type'] = 'text/event-stream'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    

    return response


@app.get("/api/chart-data")
async def chart_data() -> StreamingResponse:
    response = StreamingResponse(generate_metaheuristic_points(meta1), media_type="text/event-stream")
    #response.headers["Cache-Control"] = "no-cache"
    #response.headers["X-Accel-Buffering"] = "no"
    response.headers['Content-Type'] = 'text/event-stream'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response


if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)