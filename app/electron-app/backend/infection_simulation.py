import covasim as cv
import networkx as nx
import numpy as np
from networkx.readwrite import json_graph
from epimodels.discrete.models import SIR as SIR_disc
from epimodels.continuous.models import SIR as SIR

def build_infection_tree(sim):
    '''
    Returns annotated infection tree as a json

    sim: covasim simulation

    Param in json:
        id: node id
        status: node status (inf, sev, crit, dead)
    '''

    # build base tree
    G = nx.DiGraph()
    first_infected = sim.people.infection_log[0]['target']
    G.add_node(first_infected)
    for infection in sim.people.infection_log:
        source = infection['source']
        target = infection['target']
        if source != None and target != first_infected:
            if not G.has_edge(target, source):
                if not G.has_node(target):
                    G.add_edge(source, target)
                elif G.in_degree(target) == 0:
                    G.add_edge(source, target)
    G = nx.relabel_nodes(G, lambda x: int(x))

    # set severities
    sev = []
    crit = []
    dead = []
    id = 0
    for i in sim.people.severe:
        if i:
            sev.append(id)
        id+=1
    id = 0
    for i in sim.people.critical:
        if i:
            crit.append(id)
        id+=1
    id = 0
    for i in sim.people.dead:
        if i:
            dead.append(id)
        id+=1
    for i in G.nodes:
        G.nodes[i]['status'] = 'inf'
        if i in sev:
            G.nodes[i]['status'] = 'sev'
        if i in crit:
            G.nodes[i]['status'] = 'crit'
        if i in dead:
            G.nodes[i]['status'] = 'dead'
    
    # return annotated tree as json
    return json_graph.node_link_data(G)


def build_custom_infection_tree():
    '''
    Builds infection tree for story example
    '''
    G = nx.DiGraph()

    names = [
        "Frank", "Sophie", "Melinda", "John", "Lisa", "Belle", 
        "Max", "Flora", "Tom"
    ]
    for name in names:
        G.add_node(name, status="inf")

    edges = [
        ("Frank", "Sophie"),
        ("Frank", "Melinda"),
        ("Sophie", "John"),
        ("Sophie", "Lisa"),
        ("Melinda", "Belle"),
        ("Lisa", "Max"),
        ("Lisa", "Flora"),
        ("Max", "Tom"),
    ]
    G.add_edges_from(edges)

    return json_graph.node_link_data(G)


def get_inf_tree(pop_size=250):
    '''
    Runs covasim simulation to retreive an infection tree
    Returns infection tree json

    pop_size: sim population size
    '''
    sim = cv.Sim(pop_size=pop_size, pop_infected=1)
    sim.run()
    print(pop_size)
    return build_infection_tree(sim)

def get_dummy_tree(num_iter):
    G = nx.DiGraph()
    G.add_node(0)
    cnt = 1
    plot_data = []
    for i in range(0, num_iter):
        nodes = list(G.nodes)
        plot_data.append([i, len(nodes)])
        for n in nodes:
            if len(list(G.successors(n))) < 1:
                for j in range(0, np.random.choice([1, 2, 3, 4])):
                    G.add_edge(n, cnt)
                    cnt += 1
    for i in G.nodes:
        G.nodes[i]['status'] = 'inf'
    data = json_graph.node_link_data(G)
    data['plot_data'] = plot_data
    return data

def get_sir_data(
    transmission_rate=1,
    recovery_rate=0,
    discrete=True,
    pop_size=12,
    n_inf=1,
    n_days=8
):
    if discrete:
        model = SIR_disc()
    else:
        model = SIR()

    model([pop_size - n_inf, n_inf, 0], [0, n_days], pop_size, {
        'beta': transmission_rate,
        'gamma': recovery_rate
    })

    traces = model.traces
    times = traces['time']
    S = traces['S']
    I = traces['I']
    R = traces['R']

    # Convert to desired format
    S_data = [[float(t), float(s)] for t, s in zip(times, S)]
    I_data = [[float(t), float(i)] for t, i in zip(times, I)]
    R_data = [[float(t), float(r)] for t, r in zip(times, R)]
    plots = []
    plots.append(S_data)
    plots.append(I_data)
    if recovery_rate != 0:
        plots.append(R_data)

    return {
        "plot_data": plots
    }


