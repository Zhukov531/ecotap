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
        './img/2.svg',
        './img/3.svg',
        './img/4.svg',
        './img/5.svg',
        './img/6.svg'
    ];

    // Обработчик клика по кнопке семечка
    seedButton.addEventListener('click', function () {
        if (!timer && currentStage < treeStages.length) {
            mainImage.src = treeStages[currentStage]; // Меняем основное изображение на следующее
            drops[currentDrop].src = './img/bluedrop.svg'; // Меняем изображение капли на заполненное
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
            drops[currentDrop].src = './img/bluedrop.svg'; // Меняем изображение капли на заполненное
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
