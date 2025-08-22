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
    plot_data.append([num_iter, cnt])
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
    n_rec=0,
    n_days=8
):
    if discrete:
        model = SIR_disc()
    else:
        model = SIR()

    model([pop_size - n_inf - n_rec, n_inf, n_rec], [0, n_days], pop_size, {
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

def get_coin_flip_data(n_flips=100):
    """
    Simulate n_flips fair coin flips and return running sums
    for Heads and Tails in the format:
    {"plot_data": [heads_data, tails_data]}
    """

    flips = np.random.randint(0, 2, size=n_flips)

    heads_running = np.cumsum(flips)
    tails_running = np.cumsum(1 - flips)

    times = np.arange(0, n_flips + 1)
    heads_running = np.insert(heads_running, 0, 0)
    tails_running = np.insert(tails_running, 0, 0)

    H_data = [[float(t), float(h)] for t, h in zip(times, heads_running)]
    T_data = [[float(t), float(tt)] for t, tt in zip(times, tails_running)]

    return {
        "plot_data": [H_data, T_data]
    }

def get_gossip_data(pop_size=30, conversations_per_day=1, n_days=7):
    """
    Simulate gossip spread via coin flips.

    Rules:
      - Start with one person who knows the gossip.
      - For each of n_days:
          * Each person initiates `conversations_per_day` conversations.
          * Conversation partner is chosen uniformly at random from the other people.
          * If exactly one of the two knows the gossip, there is a 50% chance the
            other learns it. When someone learns it for the first time, we add a
            directed edge from the informer to the learner in the infection tree.
      - The graph returned represents the path of spread (who told whom, first time).
      - plot_data contains the running sum of people who know the gossip at the end of each day,
        with an initial point for day 0.

    Returns:
        dict: node-link graph JSON with an extra key 'plot_data' like:
              {
                "nodes": [...],
                "links": [...],
                ...,
                "plot_data": [[day0, count0], [day1, count1], ...]
              }
    """
    G = nx.DiGraph()

    initial = int(np.random.randint(0, pop_size))
    knows = set([initial])
    G.add_node(initial, status="inf")

    def choose_partner(i):
        j = i
        while j == i:
            j = int(np.random.randint(0, pop_size))
        return j

    plot_data = [[0.0, float(len(knows))]]

    for day in range(1, n_days + 1):
        for person in range(pop_size):
            for _ in range(conversations_per_day):
                partner = choose_partner(person)

                a_knows = person in knows
                b_knows = partner in knows

                if a_knows ^ b_knows:
                    if int(np.random.randint(0, 2)) == 1:
                        if a_knows and not b_knows:
                            source, target = person, partner
                        else:
                            source, target = partner, person

                        if target not in knows:
                            knows.add(target)
                            if not G.has_node(source):
                                G.add_node(source, status="inf")
                            if not G.has_node(target):
                                G.add_node(target, status="inf")
                            G.add_edge(source, target)

        plot_data.append([float(day), float(len(knows))])

    data = json_graph.node_link_data(G)
    data["plot_data"] = plot_data
    return data


def get_partial_sir_data(
    start_index=0, # start: 2020-03-06 
    end_index=None, # end: 2021-10-17
    include_generated=False,
    *,
    # only used if include_generated=True; pop_size and n_inf are overridden from data
    transmission_rate=1,
    recovery_rate=0,
    discrete=False,
    sim_extra_days=0
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
        [[i, value] for i, (_, value) in enumerate(trace[start_index:end_index])]
        for trace in full_data["plot_data"]
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
            n_rec=R0,
            n_days=n_days_effective + sim_extra_days
        )["plot_data"]

        gen_slice = [trace[:window_len] for trace in gen]

        result_traces.extend(gen_slice)

    return {"plot_data": result_traces}




