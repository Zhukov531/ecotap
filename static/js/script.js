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
        '/static/img/6.svg'
    ];

    // Обработчик клика по кнопке семечка
    seedButton.addEventListener('click', function () {
        if (!timer && currentStage < treeStages.length) {
            mainImage.src = treeStages[currentStage]; // Меняем основное изображение на следующее
            drops[currentDrop].src = '/static/img/bluedrop.svg'; // Меняем изображение капли на заполненное
            currentDrop++;
            currentStage++;
            seedButton.style.display = 'none'; // Скрыть кнопку семечка
            waterButton.style.display = 'block'; // Показать кнопку воды
            startTimer();
        }
    });

    // Обработчик клика по кнопке капли
    waterButton.addEventListener('click', function () {
        if (!timer && currentStage < treeStages.length) {
            mainImage.src = treeStages[currentStage]; // Обновляем изображение дерева
            drops[currentDrop].src = '/static/img/bluedrop.svg'; // Меняем изображение капли на заполненное
            currentDrop++;
            currentStage++;
            if (currentDrop >= drops.length) {
                waterButton.style.display = 'none'; // Скрыть кнопку капли
                transferButton.style.display = 'block'; // Показать кнопку передачи
            } else {
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
        drops.forEach(drop => drop.src = '/static/img/whitedrop.svg'); // Сбрасываем изображения капель
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
    }
});
