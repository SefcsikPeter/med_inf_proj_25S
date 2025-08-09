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

import json

def get_partial_sir_data(
    start_index=0, # start: 2020-03-06 
    end_index=None, # end: 2021-10-17
    include_generated=False,
    *,
    # only used if include_generated=True; pop_size and n_inf are overridden from data
    transmission_rate=1,
    recovery_rate=0,
    discrete=False
):
    """
    Extract a subset of SIR data from a JSON file between two indices.
    Optionally generate an SIR series whose initial conditions (pop_size, n_inf)
    are inferred from the first day of the selected window in the empirical data,
    and append the generated series to the empirical plot_data.
    source for estimation:
    https://github.com/GoogleCloudPlatform/covid-19-open-data/blob/main/docs/table-epidemiology.md
    The data points represent estimated SIR compartments for Austria during COVID-19.
    Index 0 corresponds to the first date after cumulative confirmed cases exceeded 100.

    Returns:
        {
            "plot_data": [
                S_emp, I_emp, (R_emp if present),
                S_gen, I_gen, (R_gen if recovery_rate != 0)
            ]
        }
    """
    with open('at_covid_sir.json', "r") as f:
        full_data = json.load(f)

    # real-world SIR estimation from austria
    plot_data_empirical = [
        trace[start_index:end_index] for trace in full_data["plot_data"]
    ]

    result_traces = list(plot_data_empirical)

    if include_generated:
        try:
            S0 = float(full_data["plot_data"][0][start_index][1])
            I0 = float(full_data["plot_data"][1][start_index][1])
            R0 = float(full_data["plot_data"][2][start_index][1]) if len(full_data["plot_data"]) >= 3 else 0.0
        except (IndexError, ValueError) as e:
            raise ValueError(
                "Unable to infer initial conditions from empirical data at the given start_index."
            ) from e

        inferred_pop_size = int(round(S0 + I0 + R0))
        inferred_n_inf   = int(round(I0))

        total_len = len(full_data["plot_data"][0])
        window_len = (end_index if end_index is not None else total_len) - start_index
        if window_len <= 0:
            raise ValueError("The requested index window is empty. Check start_index/end_index.")

        n_days_effective = window_len - 1

        gen = get_sir_data(
            transmission_rate=transmission_rate,
            recovery_rate=recovery_rate,
            discrete=discrete,
            pop_size=inferred_pop_size,
            n_inf=inferred_n_inf,
            n_days=n_days_effective
        )["plot_data"]

        gen_slice = [trace[:window_len] for trace in gen]

        result_traces.extend(gen_slice)

    return {"plot_data": result_traces}




