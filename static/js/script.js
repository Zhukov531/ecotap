document.addEventListener('DOMContentLoaded', function () {
    // Показать всплывающее окно при загрузке страницы
    document.getElementById('languagePopup').classList.remove('hidden');

    // Обработчики кликов для выбора языка
    document.getElementById('langRu').addEventListener('click', function () {
        document.getElementById('languagePopup').classList.add('hidden');
    });

    document.getElementById('langEn').addEventListener('click', function () {
        document.getElementById('languagePopup').classList.add('hidden');
    });

    let timerElement = document.getElementById('timer');
    let seedButton = document.getElementById('seedButton');
    let waterButton = document.getElementById('waterButton');
    let transferButton = document.getElementById('transferButton');
    let mainImage = document.getElementById('mainImage');
    let drops = document.querySelectorAll('.drop');
    let currentDrop = 0;
    let currentStage = 0;
    let timer;

    // Массив изображений для различных стадий дерева
    const treeStages = [
        '/static/img/2.svg',
        '/static/img/3.svg',
        '/static/img/4.svg',
        '/static/img/5.svg',
        '/static/img/6.svg',
        '/static/img/7.svg'
    ];

    // Обработчик клика по кнопке семечка
    seedButton.addEventListener('click', function () {
        if (!timer && currentStage < treeStages.length) {
            mainImage.src = treeStages[currentStage]; // Меняем основное изображение на следующее
            currentStage++;
            seedButton.style.display = 'none'; // Скрыть кнопку семечка
            waterButton.style.display = 'block'; // Показать кнопку воды
            document.querySelector('.manag-text p').textContent = 'Полейте ваше дерево';
            startTimer();
        }
    });

    // Обработчик клика по кнопке капли
    waterButton.addEventListener('click', function () {
        if (!timer && currentStage < treeStages.length) {
            mainImage.src = treeStages[currentStage]; // Обновляем изображение дерева
            drops[currentDrop].src = '/static/img/bluedrop.svg';
            currentDrop++;
            currentStage++;
            if (currentStage >= treeStages.length) {
                waterButton.style.display = 'none'; // Скрыть кнопку капли
                transferButton.style.display = 'block'; // Показать кнопку передачи
                document.querySelector('.manag-text p').textContent = 'Отправьте дерево в заповедник';
                timerElement.textContent = 'Дерево выросло'; // Обновляем текст таймера
            } else {
                document.querySelector('.manag-text p').textContent = 'До следующего полива';
                startTimer();
            }
        }
    });

    // Обработчик клика по кнопке recycle
    transferButton.addEventListener('click', function () {
        // Сброс переменных и элементов интерфейса
        currentDrop = 0;
        currentStage = 0;
        mainImage.src = '/static/img/1.svg'; // Возвращаем основное изображение на первую стадию
        seedButton.style.display = 'block'; // Показываем кнопку семечка
        waterButton.style.display = 'none'; // Скрываем кнопку воды
        transferButton.style.display = 'none'; // Скрываем кнопку recycle
        drops.forEach(drop => drop.src = '/static/img/whitedrop.svg');
        document.querySelector('.manag-text p').textContent = 'Посадите дерево';
        timerElement.textContent = '00:00:00'; // Сбрасываем текст таймера
        $.ajax({
            url: '/add-eco',  // Замените на правильный URL вашего эндпоинта
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                user_id: tg.user.id,  // Подставляем user_id пользователя
                amount: 1000  // Указываем количество эконов для пополнения
            }),
            success: function(response) {
                if (response.success) {
                    // Обновляем баланс эконов на странице
                    document.getElementById('ecoAmount').textContent = response.new_balance;

                    // Если нужно, перезагрузите данные страницы (не обязательно перезагружать всю страницу)
                    // Например, обновите другие элементы, если нужно
                    console.log('Баланс успешно обновлён');
                } else {
                    console.log('Ошибка при пополнении эконов');
                }
            },
            error: function() {
                console.log('Ошибка при отправке запроса на сервер');
            }
        });
        // Добавление токенов eco
        let ecoElement = document.getElementById('eco'); // Получаем элемент с количеством токенов ECO
        let currentEco = parseInt(ecoElement.textContent); // Получаем текущее количество токенов ECO
        let newEco = currentEco + 100; // Добавляем 100 токенов ECO
        ecoElement.textContent = newEco; // Обновляем текст с количеством токенов ECO
    });

    // Функция запуска таймера
    function startTimer() {
        let timeLeft = 3; // Установить таймер на 3 секунды
        disableButtons(); // Заблокировать кнопки
        timer = setInterval(function () {
            if (timeLeft <= 0) {
                clearInterval(timer);
                timer = null;
                enableButtons(); // Разблокировать кнопки
                timerElement.textContent = '00:00:00';
            } else {
                let seconds = timeLeft % 60;
                timerElement.textContent = `00:00:${seconds < 10 ? '0' + seconds : seconds}`;
                timeLeft--;
            }
        }, 1000);
    }

    // Функция блокировки кнопок
    function disableButtons() {
        seedButton.disabled = true;
        waterButton.disabled = true;
        seedButton.classList.add('disabled');
        waterButton.classList.add('disabled');
    }

    // Функция разблокировки кнопок
    function enableButtons() {
        seedButton.disabled = false;
        waterButton.disabled = false;
        seedButton.classList.remove('disabled');
        waterButton.classList.remove('disabled');
        if (currentDrop >= drops.length) {
            document.querySelector('.manag-text p').textContent = 'Отправьте дерево в заповедник';
        } else {
            document.querySelector('.manag-text p').textContent = 'Полейте ваше дерево';
        }
    }
});
