from typing import Union
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from tortoise.contrib.fastapi import register_tortoise
from db import *

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templ = Jinja2Templates(directory="templates")


register_tortoise(
    app,
    config={
    'connections': {
        'default': 'sqlite://database.db',
    },
    'apps': {
    'models': {
    'models': ['db'],
    'default_connection': 'default',
    }}},

    generate_schemas=True,
    add_exception_handlers=True)





# самое начало
@app.get("/", name='index')
async def root(request: Request):
    return templ.TemplateResponse('index.html', context={'request': request})

# профиль
@app.get("/profile", name='profile')
async def get_profile(request: Request):
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

    user = await User.get(user_id=user_id)
    """rating - место в рейтинге
eco - кол-во токенов
jeton - кол-во жетонов
tree - уровень растения (1-7)
drop - кол-во капель
timer - время последнего полив
"""
    # Здесь можно добавить логику для обработки данных, например запрос в базу данных
    # Например:
    if user_id:
        # Пример ответа, можно заменить на реальную логику
        return JSONResponse(content={"success": True,
        'rating': 1,
        'eco': user.balance,
        'jeton': 0,
        'tree': 1,
        'drop': 0,
        'timer': 0 }, status_code=200)
    else:
        return JSONResponse(content={"success": False}, status_code=400)


@app.post("/user-data-profile")
async def handle_user_profile(request: Request):
    data = await request.json()
    user_id = data.get('user_id')

    user = await User.get(user_id=user_id)
    count = await Task_User.filter(user_id=user_id).count()
    """профиль
rating - место в рейтинге
eco - кол-во токенов
jeton - кол-во жетонов
complet_task - кол-во выполненных задач"""
  
    if user_id:
        # Пример ответа, можно заменить на реальную логику
        return JSONResponse(content={"success": True,
        'rating': 1,
        'eco': user.balance,
        'jeton': 0,
        'complet_task': count,
        }, status_code=200)
    else:
        return JSONResponse(content={"success": False}, status_code=400)


@app.post("/add-eco")
async def add_eco(request: Request):
    data = await request.json()
    user_id = data.get('user_id')
    amount = data.get('amount')

    # Найдите пользователя по user_id и добавьте эконы к балансу
    user = await User.get(user_id=user_id)
    user.balance += amount
    await user.save()

    return JSONResponse(content={"success": True, "new_balance": user.balance}, status_code=200)