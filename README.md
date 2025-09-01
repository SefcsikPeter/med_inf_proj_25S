## Introduction

This repository contains the code for the epidemiology learning application and its prototypes, which was created as part of the Project in Medical Informatics 2025S.

## Application Summary

This application is meant to give an introduction to epidemiology and epidemic visualization without the need of any specific background knowledge apart from an elementary school-level math understanding.

It is specifically designed for children of ages 10-14 but can also contain new information for different age groups, especially in the later lectures.

On the starting page, the user is presented with a selection of lectures that can be selected. At first, there will be only one alternative, but as the user progresses, more and more lectures get unlocked.

If a lecture is discontinued before the last slide, the progress gets saved, and the user gets to continue from where they exited the lecture.

Each lecture can be 'passed' by doing a quiz about it. If the user makes a mistake in  one of the questions, a hint appears that links to the lecture slide related to the question.

If a user feels that they already know about a certain subject, the lecture about that subject can be skipped by doing the related quiz without needing to read the lecture first.

With each completed quiz, the user receives a badge to signify their progress. The user's collection of badges can be explored on the 'Badges' page. Clicking a badge on this page links to the related lecture.

If,for some reason, the user decides to redo the whole course, there's a button for resetting all progress made in the app at the 'Settings' page.

## Installer

The main purpose of this repository is to demonstrate how the application works. The application itself can be installed using the installer contained within this Google Drive folder:
https://drive.google.com/drive/folders/1t8XNVfiBc3EmE315Tp2VH8ICo547j0tw?usp=sharing

For now, the installer is only compatible with Windows devices.
After running the installer, the application starts automatically. This process may take a while the first time.
The installer creates a desktop shortcut called 'Infection Visualiser'. This can later be used to start the application without the installer, and to locate the folder containing all the application's data and the uninstaller.

## Requirements
Due to the inclusion of numerous assets and a fully packaged Python environment with preinstalled libraries, the application requires around **2 GB** of storage.

This application is a web-based system bundled as a desktop executable using Electron. As a result, it runs a local server and requires the following ports to be available on the host machine:

- Port **8000** – Used by the backend server (Python)
- Port **4200** – Used by the frontend interface (Angular)

## JSON Structure
The stories and quizzes contained in the application are stored in the form of json files, where new stories, slides, quizzes and quiz questions can be added.

### stories.json
- **id**: story identification number (unique, integer, required)
- **title**: story title (string, required)
- **chapter**: ID of the chapter that the story belongs to (integer, required)
- **requires**: array of IDs of stories that are required to be passed for access to the current story ([integer], required)
- **slides**: contains an array of slide objects containing the learning material ([object], required)
    - **text**: text displayed within slide (string, required)
    - **image**: name of image displayed within slide, stored at electron-app/backend/static/images (string, optional)
    - **data**: object containing data that is to be queried from the backend for visualization (object, optional)
        - **type**: type of data to be queried (enum: [dummy_tree, example_tree, sir, sir_at, coin_flip, coin_flip_gossip], required)
    - **vis1**: visualization object containing details of a specific visualization type (object, optional)
        - **type**: type of visualization (enum: [inf_tree, rad_tree, line_plot, multiline_plot], required)
    - **vis2**: second visualization object containing details of a specific visualization type (object, optional)
        - **type**: type of visualization (enum: [inf_tree, rad_tree, line_plot, multiline_plot], required)
    - **sliders**: array of slider objects used to manipulate visualizations ([object], optional)
        - **type**: type of data or setting that the slider changes (enum: [depth, n_days, transmission_rate, recovery_rate, pop_size, n_flips], required)
        - **min**: smallest value the slider can take (float, required)
        - **max**: largest value the slider can take (float, required)
        - **step**: step size of moved slider (float, required)
        - **current_value**: value the slider is originally set to upon opening the slide (float, required)
        - **symbol**: name of symbol displayed before slider (enum: [sun, virus, bed, water, coin, conversation], required)
        - **text**: text displayed after slider (text, required)
### stories.json:data Details by Type
- **dummy_tree**: generates dummy tree using the *get_dummy_tree()* function from electron-app/backend/infection_simulation.py, **returns** tree and plot data
    - **num_iter**: number of iterations performed for generating tree (integer)
- **example_tree**: returns specific tree created for the infection tree story, has no additional parameters, **returns** tree data
- **sir**: generates sir data based on the input parameters using electron-app/backend/infection_simulation.py:*get_sir_data()*, **returns** plot data    
    - **transmission_rate**: transmission rate *beta* (float)
    - **recovery_rate**: recovery_rate rate *gamma* (float)
    - **discrete**: if true, a discrete sir implementation is used, if false, the standard continuous implementation is used (boolean)
    - **pop_size**: total population size in simulation (integer)
    - **n_inf**: number of people initially infected, meaning people in **I** compartment in simulation (integer)
    - **n_rec**: number of people initially recovered/removed, meaning people in **R** compartment in simulation (integer)
    - **n_days**: number of days in simulation (integer)
- **sir_at**: returns real-world sir data from austria in given time period with possibility to also include sir generated data, uses electron-app/backend/infection_simulation.py:*get_partial_sir_data()*, **returns** plot data
    - **start_index**: start index of real-world data to be returned (integer)
    - **end_index**: end index of real-world data to be returned (integer)
    - **include_generated**: adds sir generated data if true, does not if false (boolean)
    - **transmission_rate**: simulation transmission rate *beta* (float, only if include_generated)
    - **recovery_rate**: simulation recovery_rate rate *gamma* (float, only if include_generated)
    - **sim_extra_days**: can be used to set simulation to run longer than the selected real world data window, adds as many days to simulation as specified by the set number (integer, only if include_generated)
- **coin_flip**: returns running sum of number of heads and tails of simulated coin flips, uses electron-app/backend/infection_simulation.py:*get_coin_flip_data()*, returns plot data
    -**n_flips**: number of flips to be generated (integer)
- **coin_flip_gossip**: returns gossip spread simulation data, uses electron-app/backend/infection_simulation.py:*get_gossip_data()*, returns tree and plot data
    - **pop_size**: population size in simulation (integer)
    - **conversations_per_day**: number of conversations an instance of the population has a day (integer)
    - **n_days**: number of simulated days (integer)
