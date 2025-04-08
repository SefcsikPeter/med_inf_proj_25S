from fastapi import FastAPI
import uvicorn
import covasim as cv
import networkx as nx
import numpy as np
import json
from infection_simulation import get_inf_tree
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # 👈 Angular dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GRAPH_FILE = "graph.json"

@app.get("/")
def home():
    return {"message": "Welcome to the Infection Tree API"}


@app.get("/inf-tree")
def get_graph(pop_size: int = Query(250, description="Population size")):
    '''
    Returns infection tree as json
    params:
        pop_size = 250 by default, population size for simulation
    '''
    return get_inf_tree(pop_size)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
