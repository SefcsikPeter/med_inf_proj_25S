from fastapi import FastAPI
import uvicorn
import covasim as cv
import networkx as nx
import numpy as np
import json
from infection_simulation import get_inf_tree, get_dummy_tree, get_sir_data
from fastapi import Query, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
print('cwd', os.getcwd())

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
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

@app.get("/dummy-tree")
def get_graph(num_iter: int = Query(5, description="Number of iterations")):
    '''
    Creates dummy tree as json for story
    params:
        num_iter = 5 by default, determines the tree depth
    '''
    return get_dummy_tree(num_iter)

@app.get("/sir")
def get_graph(transmission_rate: int = Query(1, description="Transition rate"), recovery_rate: int = Query(0, description="Recovery rate")):
    '''
    Creates sir lineplot data
    params:
        transmission_rate = 1 by default, determines the tree depth
    '''
    return get_sir_data()

@app.get("/story/{story_id}")
def get_story_slide(
    story_id: int = Path(..., description="ID of the story"),
    page: int = Query(0, description="Page number (slide index)")
):
    try:
        with open("stories.json", "r") as f:
            stories = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="stories.json not found")

    story_index = next((i for i, s in enumerate(stories) if s["id"] == story_id), None)
    if story_index is None:
        raise HTTPException(status_code=404, detail="Story not found")

    slides = stories[story_index].get("slides", [])
    if page < 0 or page >= len(slides):
        raise HTTPException(status_code=404, detail="Slide not found")

    stories[story_index]["progress"] = page + 1

    try:
        with open("stories.json", "w") as f:
            json.dump(stories, f, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving progress: {str(e)}")

    return {
        "slide": slides[page],
        "page": page,
        "image": slides[page].get('image')
    }

@app.get("/story")
def get_story_data():
    try:
        with open("stories.json", "r") as f:
            stories = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="stories.json not found")

    formatted_stories = []
    for story in stories:
        formatted_stories.append({
            "id": story["id"],
            "progress": story["progress"]/len(story.get("slides", [])) if "progress" in story else 0,
            "title": story["title"],
            "page": (story["progress"] - 1 if story["progress"] > 0 else 0) if "progress" in story else 0
        })

    return {
        "stories": formatted_stories
    }


@app.get("/story/{story_id}/data")
def get_story_data(
    story_id: int = Path(..., description="ID of the story"),
):
    try:
        with open("stories.json", "r") as f:
            stories = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="stories.json not found")

    story = next((s for s in stories if s["id"] == story_id), None)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")

    slides = story.get("slides", [])

    return {
        "title": story.get("title", "Untitled"),
        "total_pages": len(slides),
        "data": story.get("data", []),
    }

@app.get("/quiz/{story_id}/data")
def get_quiz_data(
    story_id: int = Path(..., description="ID of the story of the quiz"),
):
    try:
        with open("quizzes.json", "r") as f:
            quizzes = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="quizzes.json not found")

    quiz = next((s for s in quizzes if s["id"] == story_id), None)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    questions = quiz.get("questions", [])

    return {
        "title": quiz.get("title", "Untitled"),
        "total_pages": len(questions)
    }

@app.get("/quiz/{story_id}")
def get_question(
    story_id: int = Path(..., description="ID of the story"),
    page: int = Query(0, description="Page number (question index)")
):
    try:
        with open("quizzes.json", "r") as f:
            quizzes = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="quizzes.json not found")

    quiz_index = next((i for i, q in enumerate(quizzes) if q["id"] == story_id), None)
    if quiz_index is None:
        raise HTTPException(status_code=404, detail="Quiz for story not found")

    questions= quizzes[quiz_index].get("questions", [])
    if page < 0 or page >= len(questions):
        raise HTTPException(status_code=404, detail="Question not found")

    quizzes[quiz_index]["progress"] = page + 1

    try:
        with open("quizzes.json", "w") as f:
            json.dump(quizzes, f, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving progress: {str(e)}")

    return {
        "slide": questions[page],
        "page": page,
        "image": questions[page].get('image')
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
