const MAX_ENEMY = 7;

const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div'),
      bestScore = document.getElementById('bestScore');

const audio = document.createElement('embed');

audio.src = 'audio.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = `
  position: absolute;
  top: -1000px;
`;

car.classList.add('car');

const countRoad = gameArea.style.height = Math.floor(document.documentElement.clientHeight / 100) * 100;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0
};

bestScore.textContent = localStorage.getItem('nfJS', setting.score) ? localStorage.getItem('nfJS', setting.score) : 0;

const addLocalStorage = () => {
  localStorage.setItem('nfJS', setting.score);
  bestScore.textContent = setting.score;
};

function getQuantityElements(heightElement) {
  return (countRoad / heightElement) + 1;
}

function startGame(event) {

  const target = event.target;
  
  if(target === start) return;

  switch(target.id) {
    case 'easy': 
      setting.speed = 3;
      setting.traffic = 4;
      break;
    case 'medium': 
      setting.speed = 5;
      setting.traffic = 3;
      break;
    case 'hard': 
      setting.speed = 8;
      setting.traffic = 2;
      break;
  }



  start.classList.add('hide');
  gameArea.innerHTML = '';
  car.style.left = 125 + 'px';
  car.style.top = 'auto';
  car.style.bottom = 10 + 'px';
  for (let i = 0; i < getQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.append(line);
  }


  for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.top = enemy.y + 'px';
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
    gameArea.append(enemy);
  }


  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  document.body.append(audio);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if(setting.start) {
    setting.score += setting.speed;
    score.innerHTML = `SCORE <br>${setting.score}`;
    moveRoad();
    moveEnemy();
    if(keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - 50)) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed;
    }


    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  event.preventDefault();
  keys[event.key] = true;
}

function stopRun(event) {
  event.preventDefault();
  keys[event.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(line => {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if(line.y >= document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if(carRect.top <= enemyRect.bottom && 
        carRect.right >= enemyRect.left &&
        carRect.left <= enemyRect.right &&
        carRect.bottom >= enemyRect.top) {
      setting.start = false;
      console.warn('Crash');
      start.classList.remove('hide');
      start.style.top = 80 + 'px';
      audio.remove();
      addLocalStorage();
    }


    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }
  });
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
