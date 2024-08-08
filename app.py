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

@app.post("/user-data")
async def handle_user_data(request: Request):
    data = await request.json()
    user_id = data.get('user_id')
    
    # Здесь можно добавить логику для обработки данных, например запрос в базу данных
    # Например:
    if user_id:
        # Пример ответа, можно заменить на реальную логику
        return JSONResponse(content={"success": True}, status_code=200)
    else:
        return JSONResponse(content={"success": False}, status_code=400)