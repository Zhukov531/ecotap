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
    return templ.TemplateResponse('tasks.html', context={'request': request})


@app.get("/friends", name='friends')
def get_friend(request: Request):
    return templ.TemplateResponse('friends.html', context={'request': request})

@app.get("/upgrade", name='upgrade')
def get_upgrade(request: Request):
    return templ.TemplateResponse('upgrade.html', context={'request': request})

@app.get("/preview", name='preview')
def get_upgrade(request: Request):
    return templ.TemplateResponse('preview.html', context={'request': request})

@app.post("/user-data")
async def handle_user_data(request: Request):
    data = await request.json()
    user_id = data.get('user_id')

    user, created = await User.get_or_create(user_id=user_id)
    if created:
        user.name = data.get('name')
        await user.save()

    if user_id:
        # Допустим, у пользователя есть поля `tree_level` и `drop_count`
        tree_level = user.tree_level
        drop_count = user.drop_count

        return JSONResponse(content={
            "success": True,
            "rating": await get_user_rank(user_id),
            "eco": user.balance,
            "jeton": 0,
            "tree": tree_level,
            "drop": drop_count,
            "timer": user.timer  # Если это поле отслеживает время полива
        }, status_code=200)
    else:
        return JSONResponse(content={"success": False}, status_code=400)



@app.post("/user-data-profile")
async def handle_user_profile(request: Request):
    data = await request.json()
    user_id = data.get('user_id')

    user = await User.get(user_id=user_id)
    complet_task = await Task_User.filter(user_id=user_id).count()
    reff = await User.all().filter(ref=user_id).count()
    rank = await get_user_rank(user_id)
    """профиль
rating - место в рейтинге
eco - кол-во токенов
jeton - кол-во жетонов
complet_task - кол-во выполненных задач
tree_count - кол-во деревьев
count_friend - кол-во друзей
"""
    if user_id:
        # Пример ответа, можно заменить на реальную логику
        return JSONResponse(content={"success": True,
        'rating': rank,
        'eco': user.balance,
        'jeton': 0,
        'complet_task': complet_task,
        'tree_count': 0,
        'count_friend': reff,
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





async def get_user_rank(user_id: int):
    # Получаем всех пользователей, отсортированных по балансу в убывающем порядке
    users = await User.all().order_by('-balance').values_list('user_id', flat=True)

    # Находим позицию пользователя в этом списке
    try:
        rank = users.index(user_id) + 1
    except ValueError:
        rank = None  # Если пользователь не найден
    
    return rank