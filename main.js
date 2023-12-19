let numbersArray = [];
let guessedCards = [];
let countOpenCards = 0;
let contentOpenCard1 = 0;
let contentOpenCard2 = 0;

//контейнер для игры
const gameContainer = document.querySelector('#game');
//кнопка "Начать игру"
const startButton = document.querySelector('#startButton');
//прячем кнопку "Сыграть ещё"
const gameBottomMenu = document.querySelector('#againButton');
gameBottomMenu.classList.add('visually-hidden');

//создание массива
function createNumbersArray(cardQty) {
  for (i = 0; i < cardQty; i += 1) {
    numbersArray.push(i + 1);
    numbersArray.push(i + 1);
  };
  return numbersArray;
};

//перемешивание массива
function shuffle(arr, cardQty) {
  const array = [...arr];
  for (let i = 0; i < array.length; i++) {
    temp = array[i];
    const j = Math.floor(Math.random() * cardQty);
    array[i] = array[j];
    array[j] = temp;
  }
  return array
}

//возврат перемешанного массива
function createShuffledArray(cardQty) {
  return shuffle(createNumbersArray(cardQty), cardQty);
};

//функция render поля карточек
function render(colCount, cardType) {
  numbersArray = [];
  guessedCards = [];
  const cardQty = (colCount * colCount) / 2;
  const shuffledArray = createShuffledArray(cardQty);
  let cardList = createCardList();
  gameContainer.append(cardList);

  console.log('start');
  console.log('array', numbersArray);
  console.log('shuffled', shuffledArray);

  for (i = 0; i < shuffledArray.length; i += 1) {
    let card = createCard(colCount, cardType);
    card.dataset.content = shuffledArray[i].toString();
    cardList.append(card);
    card.addEventListener('click', checkOpenCards);
  }

  gameBottomMenu.addEventListener('click', function () {
    cleanContainer();
    cleanTimer();
    startButton.disabled = false;
  });
}

//создание списка для карточек
function createCardList() {
  let list = document.createElement('ul');
  list.classList.add('list-group', 'd-flex', 'flex-wrap', 'flex-row', 'card-list');
  return list;
}

//создание карточки
function createCard(colCount, cardType) {
  let card = document.createElement('li');
  card.classList.add('d-flex');
  card.classList.add('cardGame');
  card.classList.add(cardTypeClass(cardType));
  card.style.width = `calc((100% - (10px * (${colCount} - 1))) / ${colCount})`;
  card.style.height = `calc((70vh - (10px * (${colCount} - 1))) / ${colCount})`;
  return card;
}

let closeOpenCardsTimer;

//проверка кол-ва открытых карточек и разрешение на открытие
function checkOpenCards(event) {
  const card = event.target;
  const isFirstCard = countOpenCards === 0;
  const isSecondCard = countOpenCards === 1;
  if (isFirstCard) {
    if (closeOpenCardsTimer) {
      clearTimeout(closeOpenCardsTimer);
    }
    closeOpenCards();
    card.classList.add('cardGame--open');
    card.textContent = card.dataset.content;
    contentOpenCard1 = card.dataset.content;
    console.log('contentOpenCard1', contentOpenCard1);
    countOpenCards += 1;
    return;
  }

  if (isSecondCard) {
    card.classList.add('cardGame--open');
    card.textContent = card.dataset.content;
    contentOpenCard2 = card.dataset.content;
    console.log('contentOpenCard2', contentOpenCard2);

    if (contentOpenCard1 === contentOpenCard2) {
      guessedCards.push(contentOpenCard1);
    };
    closeOpenCardsTimer = setTimeout(closeOpenCards, 1000);
    countOpenCards = 0;
    contentOpenCard1 = 0;
    contentOpenCard2 = 0;
    checkAllOpenCards()
  }

}
//*проверка все ли карты открыты
function checkAllOpenCards() {
  const cardGame = document.querySelectorAll('.cardGame');
  const cardGameOpen = document.querySelectorAll('.cardGame--open');
  if (cardGame.length === cardGameOpen.length) {
    gameBottomMenu.classList.remove('visually-hidden');
    clearInterval(timerInterval);
    startButton.disabled = true;
  }
  return
}

//закрытие карточек
function closeOpenCards() {
  allCards = document.querySelectorAll('.cardGame');
  allCards.forEach((card) => {
    if (!guessedCards.includes(card.dataset.content)) {
      card.classList.remove('cardGame--open');
      card.textContent = '';
    }
  });
}

//очистка поля игры
function cleanContainer() {
  const container = document.querySelector('#game');
  if (!container) {
    return;
  }
  container.replaceChildren();
  gameBottomMenu.classList.add('visually-hidden');
}

const input = document.querySelector('#input-colCount');

//ограничение кол-ва колонок в зависимости от медиа
let cardMax;
function myFunction(x) {
  cardMax = x.matches ? 10 : 6;
}

//получение числа колонок
function getInputValue(inputElement) {
  const value = parseInt(inputElement.value, 10);
  return value;
}

//валидация
function validateInput(inputValue) {
  myFunction(window.matchMedia("(min-width: 576px)"));
  const inRange = inputValue >= 2 && inputValue <= cardMax;
  const isOdd = inputValue % 2 === 0;
  const isValid = inRange && isOdd;

  return isValid;
}

//очистка инпута
function cleanGameMenu() {
  document.querySelector('#input-colCount').value = '';
}

//реакция на нажатие кнопки начала игры
startButton.addEventListener('click', function () {
  const inputValue = getInputValue(input);
  const isValid = validateInput(inputValue);
  cleanContainer();
  cleanTimer();

  let cardType = selectorCardType.value;

  if (isValid) {
    render(inputValue, cardType);
  } else {
    alert(`Введите чётное число от 2 до ${cardMax}`);
    input.value = 4;
    render(4, cardType);
  }

  startTimer();
});

//таймер
const timer = document.querySelector('#timer');
console.log('timer', timer.textContent);
timer.classList.add('visually-hidden');
const TIME_LIMIT = 60;

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
//внешний вид оставшегося времени
function formatTimeLeft(time) {
  // Наибольшее целое число меньше или равно результату деления времени на 60.
  const minutes = Math.floor(time / 60);
  // Секунды – это остаток деления времени на 60 (оператор модуля)
  let seconds = time % 60;
  // Если значение секунд меньше 10, тогда отображаем его с 0 впереди
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  // Вывод в формате MM:SS
  return `${minutes}:${seconds}`;
}
//функция таймера
function startTimer() {
  timer.classList.remove('visually-hidden');
  timerInterval = setInterval(() => {
    // Количество времени, которое прошло, увеличивается на  1
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    // Обновляем метку оставшегося времени
    timer.innerHTML = formatTimeLeft(timeLeft);
    if (timeLeft === 0) {
      cleanContainer();
      cleanTimer();
    }
  }, 1000);

  timer.innerHTML = formatTimeLeft(timeLeft);
}
//функция очистки таймера
function cleanTimer() {
  clearInterval(timerInterval);
  timer.innerHTML = `...`;
  timeLeft = TIME_LIMIT;
  timePassed = 0
  timer.classList.add('visually-hidden');
}

//для смены рубашки
const selectorCardType = document.querySelector('#selectCardType');
let cardType;

//функция присвоения класса
const numbers = 'numbers';
const fox = 'fox';
const cars = 'cars';

function cardTypeClass(cardType) {
  let selectedClass = '';
  if (cardType === numbers) {
    return;
  }
  if (cardType === fox) {
    selectedClass = 'card-fox';
    return selectedClass;
  }
  if (cardType === cars) {
    selectedClass = 'card-cars';
    return selectedClass;
  }
  return selectedClass;
}

//*очистка селектора, возврат к начальному состоянию
//*--- не использовала, показалось логичнее без него
function clearCardTypeSelector() {
  let selectedCardType = document.querySelector('[selected]');
  selectedCardType.removeAttribute('selected');
  const DEFAULT_CARD_TYPE = document.querySelector('#numbers');
  DEFAULT_CARD_TYPE.addAttribute('selected');
}
