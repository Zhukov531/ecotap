// Get DOM elements
const timerElement = document.querySelector('.timer');
const plantImage = document.querySelector('.plant-img');
const dropsImage = document.querySelector('.manag-drops img');
const seedButton = document.getElementById('seedButton');
const waterButton = document.getElementById('waterButton');
const transferButton = document.getElementById('transferButton');

// Initialize variables
let dropsStage = 5;
let plantStage = 0;
let timeLeft = 5;
let timerInterval;
let refillInterval;
let isTreeGrown = false;

// Objects with paths to plant and drops images
const plantImages = {
  seed: './img/1.svg',
  sapling1: './img/2.svg',
  sapling2: './img/3.svg',
  sapling3: './img/4.svg',
  sapling4: './img/5.svg',
  sapling5: './img/6.svg',
  sapling6: './img/7.svg'
};

const dropsImages = {
  0: '/img/drops/zero.svg',
  1: '/img/drops/one.svg',
  2: '/img/drops/two.svg',
  3: '/img/drops/three.svg',
  4: '/img/drops/four.svg',
  5: '/img/drops/five.svg'
};

// Function to update the timer
function updateTimer() {
  const seconds = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
  timerElement.textContent = `00:${seconds}`;
}

// Function to start the timer
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 5;
  updateTimer();
  seedButton.disabled = true;
  waterButton.disabled = true; // Блокируем кнопку полива

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(timerInterval);
      seedButton.disabled = false;

      if (dropsStage === 0) {
        refillDrops();
      } else {
        waterButton.disabled = false; // Разблокируем кнопку полива, если есть капли
      }
    }
  }, 1000);
}


// Function to refill the drops
function refillDrops() {
  clearInterval(refillInterval);
  timeLeft = 10;
  updateTimer();
  waterButton.disabled = true; // Блокируем кнопку полива

  refillInterval = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(refillInterval);
      dropsStage = 5;
      dropsImage.src = dropsImages[dropsStage];
      waterButton.disabled = false; // Разблокируем кнопку полива после пополнения капель
    }
  }, 1000);
}



// Event listener for seed button click
seedButton.addEventListener('click', () => {
  if (!seedButton.disabled) {
    seedButton.style.display = 'none';
    waterButton.style.display = 'block';
    plantStage++;
    plantImage.src = plantImages[`sapling${plantStage}`];
    startTimer();
    seedButton.disabled = true;
    // Rest of the code for seed button click
  }
});


// Event listener for water button click
waterButton.addEventListener('click', () => {
  if (!isTreeGrown) {
    if (dropsStage > 0 && !waterButton.disabled) {
      dropsStage--;
      dropsImage.src = dropsImages[dropsStage];
      plantStage++;
      plantImage.src = plantImages[`sapling${plantStage}`];

      if (dropsStage === 0) { 
        refillDrops(); // Сразу запускаем пополнение капель
      } else {
        startTimer(); // Запускаем таймер, только если есть капли
      }

      if (plantStage === 6) {
        isTreeGrown = true;
        waterButton.style.display = 'none';
        transferButton.style.display = 'block';
      }
    }
  }
});

// Event listener for transfer button click
transferButton.addEventListener('click', () => {
  // Code to transfer the tree to the reserve
});

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  seedButton.style.display = 'block';
  waterButton.style.display = 'none';
  transferButton.style.display = 'none';
});