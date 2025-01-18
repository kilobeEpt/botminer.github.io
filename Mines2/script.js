document.addEventListener('DOMContentLoaded', function () {
  // Начальная страница
  const startPage = document.getElementById('startPage');
  const mainContent = document.getElementById('mainContent');
  const startButton = document.getElementById('startButton');
  const userIdInput = document.getElementById('userId');
  const preloader = document.getElementById('preloader');

  // Основной контент
  const cellsBoard = document.querySelector('.cells-board');
  let originalState = cellsBoard ? cellsBoard.innerHTML : '';

  // Инициализация параметров
  const params = new URLSearchParams(window.location.search);
  const botName = params.get('botName') || 'Unknown';
  const language = params.get('language') || 'en';
  const botNameElement = document.getElementById('botName');
  if (botNameElement) {
    botNameElement.textContent = botName;
    botNameElement.style.display = 'block';
    botNameElement.style.color = 'white';
  }

  function hidePreloader() {
    if (preloader) {
      preloader.classList.remove('fade-in');
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.classList.remove('hidden');
        document.body.classList.add('fade-in');
      }, 1000);
    }
  }

  setTimeout(hidePreloader, 3000);

  // Кнопка для начала игры
  startButton.addEventListener('click', function () {
    const userId = userIdInput.value.trim();
    if (userId.length >= 8) {
      // Показать прелоадер
      preloader.classList.remove('hidden');

      // Симуляция загрузки данных
      setTimeout(() => {
        // Скрываем начальную страницу и показываем основной контент
        startPage.classList.add('hidden');
        mainContent.classList.remove('hidden');
        preloader.classList.add('hidden');

        // Начать основной функционал игры
        initializeGame();
      }, 2000); // 2 секунды анимации загрузки
    } else {
      alert("Введите ID, состоящий хотя бы из 8 символов.");
    }
  });

  // Функция для инициализации основной игры
  function initializeGame() {
    if (!cellsBoard) {
      console.error('Элемент .cells-board не найден.');
      return;
    }

    const trapsOptions = [1, 3, 5, 7];
    const trapsToCellsOpenMapping = {
      1: 10,
      3: 5,
      5: 4,
      7: 3
    };
    let currentPresetIndex = 0;
    const trapsAmountElement = document.getElementById('trapsAmount');
    const prevPresetBtn = document.getElementById('prev_preset_btn');
    const nextPresetBtn = document.getElementById('next_preset_btn');

    function updateTrapsAmount() {
      if (trapsAmountElement) {
        trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
      }
    }

    if (prevPresetBtn) {
      prevPresetBtn.addEventListener('click', function () {
        if (currentPresetIndex > 0) {
          currentPresetIndex--;
          updateTrapsAmount();
        }
      });
    }
    if (nextPresetBtn) {
      nextPresetBtn.addEventListener('click', function () {
        if (currentPresetIndex < trapsOptions.length - 1) {
          currentPresetIndex++;
          updateTrapsAmount();
        }
      });
    }
    updateTrapsAmount();

    function attachCellClickListeners() {
      const cells = document.querySelectorAll('.cells-board .cell');
      cells.forEach(cell => {
        cell.addEventListener('click', () => {
          cell.style.transform = 'scale(0.7)';
          setTimeout(() => {
            cell.style.transform = 'scale(1)';
          }, 200);
        });
      });
    }

    let isFirstPlay = true;

    const playButton = document.getElementById('playButton');
    if (playButton) {
      playButton.addEventListener('click', function () {
        playButton.disabled = true;

        let cells = document.querySelectorAll('.cells-board .cell');

        if (!isFirstPlay) {
          cellsBoard.innerHTML = originalState;
          attachCellClickListeners();
          cells = document.querySelectorAll('.cells-board .cell');
        }

        const trapsAmount = parseInt(trapsAmountElement.textContent);
        const cellsToOpen = trapsToCellsOpenMapping[trapsAmount] || 0;
        const selectedCells = [];

        while (selectedCells.length < cellsToOpen) {
          const randomIndex = Math.floor(Math.random() * cells.length);
          if (!selectedCells.includes(randomIndex)) {
            selectedCells.push(randomIndex);
          }
        }

        let starIndex = 0;
        function animateStars() {
          if (starIndex < selectedCells.length) {
            const index = selectedCells[starIndex];
            const cell = cells[index];

            cell.classList.add('cell-fade-out');

            setTimeout(() => {
              cell.innerHTML = '';
              const newImg = document.createElement('img');
              newImg.setAttribute('width', '40');
              newImg.setAttribute('height', '40');
              newImg.style.opacity = '0';
              newImg.style.transform = 'scale(0)';
              newImg.src = 'img/stars.svg';
              newImg.classList.add('star-animation');
              cell.appendChild(newImg);
              setTimeout(() => {
                newImg.classList.add('fade-in');
              }, 50);
              cell.classList.remove('cell-fade-out');
            }, 500);

            starIndex++;
            setTimeout(animateStars, 650);
          } else {
            playButton.disabled = false;

            if (isFirstPlay) {
              isFirstPlay = false;
            }
          }
        }
        animateStars();
      });
    }
  }
});
