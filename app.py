from typing import Union
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles



app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templ = Jinja2Templates(directory="templates")


# самое начало
@app.get("/", name='index')
def root(request: Request):
    return templ.TemplateResponse('index.html', context={'request': request})

# профиль
@app.get("/profile", name='profile')
def get_profile(request: Request):
    return templ.TemplateResponse('profile.html', context={'request': request})


@app.get("/tasks", name='tasks')
def get_tasks(request: Request):
    return {"item_id": item_id, "q": q}


@app.get("/friends", name='friends')
def get_friend(request: Request):
    return {"item_id": item_id, "q": q}

@app.get("/upgrade", name='upgrade')
def get_upgrade(request: Request):
    return {"item_id": item_id, "q": q}