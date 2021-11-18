/* global allPokemonList, _ */
let $navH1 = document.querySelector('.navh1');
const $navH2 = document.querySelector('.navh2');
const $body = document.querySelector('body');
const $startQuiz = document.querySelector('#start');
const $startModal = document.querySelector('.modal-background');
const $cancelButton = document.querySelector('#cancel');
const $submitButton = document.querySelector('form');
const $homePage = document.querySelector('div[data-view="home"]');
const $quizPage = document.querySelector('div[data-view="quiz"]');
const $input = document.querySelector('input');
const $placeholder = document.createElement('img');
const $quizImage = document.querySelector('.quiz-image');
const $quizModal = document.querySelector('#quiz-modal');
const $loadingIcon = document.querySelector('.lds-dual-ring');
const $retry = document.querySelector('#retry');
const $home = document.querySelector('#home');
const $finalModalText = document.querySelector('.quiz-ending-phrase');
const $playHistoryButton = document.querySelector('#play-history');
const $pastGamesView = document.querySelector('#past-games');
const $pokedex = document.querySelector('#pokedex');
const $homePokedex = document.querySelector('#menu-pokedex');
const $pokedexImage = document.querySelector('.pokedex-pokemon-image');
const $pokedexSearchButton = document.querySelector('.pokedex-submit');
const $pokedexSearch = document.querySelector('.pokemon-search');
const $stats = document.querySelector('.stats');
const $type = document.querySelector('.type');
const $nidoranModal = document.querySelector('#nidoran-modal');
const $maleNidoran = document.querySelector('#male');
const $femaleNidoran = document.querySelector('#female');
const $errorModal = document.querySelector('#error-modal');
const $understood = document.querySelector('#understood');
const $logo = document.querySelector('#logo');
const $howToPlayButton = document.querySelector('#how-to-play');
const $instructions = document.querySelector('#instructions');
const $closeInstructions = document.querySelector('#close-instructions');
const $pokedexScreen = document.querySelector('.screen');
$logo.addEventListener('click', changeDifficulty);
$understood.addEventListener('click', errorModal);
$home.addEventListener('click', clearQuiz);
$playHistoryButton.addEventListener('click', switchToHistory);
$homePokedex.addEventListener('click', switchPokedex);
$navH2.addEventListener('click', homeScreen);
$submitButton.addEventListener('submit', startQuiz);
$quizImage.appendChild($placeholder);
$retry.addEventListener('click', resetQuiz);
$pokedexSearchButton.addEventListener('click', searchPokemon);
$femaleNidoran.addEventListener('click', searchNidoran);
$maleNidoran.addEventListener('click', searchNidoran);
$femaleNidoran.addEventListener('click', searchNidoran);
$startQuiz.addEventListener('click', startQuizModal);
$cancelButton.addEventListener('click', hideQuizModal);
$howToPlayButton.addEventListener('click', instructions);
$closeInstructions.addEventListener('click', instructions);

function startQuizModal() {
  $startModal.className = 'modal-background';
}

$cancelButton.addEventListener('click', hideQuizModal);

function hideQuizModal() {
  $startModal.className = 'modal-background hidden';
}

function startQuiz(e) {
  e.preventDefault();
  data.trainerName = $input.value;
  $input.value = '';
  $startModal.className = 'modal-background hidden';
  $homePage.className = 'container hidden';
  $quizPage.className = 'container';
  $navH1.textContent = 'Trainer:' + data.trainerName + '  | Question ' + data.currentNumber;
  getPokemonPicture();
  createQuizContainer();
}

function generateFourRandomPokemonNumbers() {
  data.currentFour = [];
  while (data.currentFour.length < 4) {
    const random = Math.floor(Math.random() * (allPokemonList.length - 1 + 1) + 1);
    if (data.currentFour.includes(random)) {
      continue;
    } else {
      data.currentFour.push(random);
    }
  }
  data.currentPokemon = allPokemonList[data.currentFour[0] - 1];
}
generateFourRandomPokemonNumbers();

function getPokemonPicture() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[0]);
  xhr.responseType = 'json';
  xhr.addEventListener('load', handleResponseData);
  xhr.send();
}

function handleResponseData(event) {
  appendPokemonPicture(event.target.response.sprites.other['official-artwork'].front_default);
  data.currentPokemonUrl = event.target.response.sprites.front_default;
  data.currentPokemonId = event.target.response.id;
}

function appendPokemonPicture(sprite) {
  const $img = document.createElement('img');
  $img.setAttribute('src', sprite);
  if (data.hardMode === true) {
    $img.className = 'silhouette quiz-pokemon';
  } else {
    $img.className = 'quiz-pokemon';
  }
  const $quizContainer = document.querySelector('.quiz-container');
  $quizContainer.appendChild($img);
  $loadingIcon.className = 'lds-dual-ring';
  $img.addEventListener('load', questionsAndTime);
  tenSecondsBar = setTimeout(quizTimer, 10000);
}

function createQuizContainer() {
  const $quizDiv = document.querySelector('#quiz');
  const $quizContainer = document.createElement('div');
  $quizContainer.className = 'quiz-container row justify-center';
  $quizDiv.appendChild($quizContainer);
}

let tenSecondsBar = null;

function quizTimer() {
  if (data.currentNumber === 10) {
    data.wrongPokemon.push({
      pokemon: data.currentPokemon,
      sprite: data.currentPokemonUrl,
      id: data.currentPokemonId
    });
    $quizModal.className = 'modal-background';
    const $quizScore = document.querySelector('.quiz-score');
    if (data.correctPokemon.length === 10) {
      $finalModalText.textContent = 'Perfect!';
    } else if (data.correctPokemon.length >= 7) {
      $finalModalText.textContent = 'Professor Oak would be proud!';
    } else if (data.correctPokemon.length >= 4) {
      $finalModalText.textContent = 'Not bad, but you can do better!';
    } else {
      $finalModalText.textContent = "Can't hurt to try again!";
    }
    $quizScore.textContent = 'Score: ' + data.correctPokemon.length + '/10';
    clearTimeout(tenSecondsBar);
    data.pastGames.push({
      trainerName: data.trainerName,
      correctPokemon: data.currentPokemon,
      wrongPokemon: data.wrongPokemon,
      hardMode: data.hardMode
    });
  } else {
    const $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push({
      pokemon: data.currentPokemon,
      sprite: data.currentPokemonUrl,
      id: data.currentPokemonId
    });
    data.currentNumber++;
    $navH1.textContent = 'Trainer:' + data.trainerName + '  | Question ' + data.currentNumber;
    const $quizContainer = document.querySelector('.quiz-container');
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture();
  }
}

function questionsAndTime() {
  $loadingIcon.className = 'lds-dual-ring hidden';
  const $barRow = document.createElement('div');
  $barRow.className = 'bar';
  const $quizContainer = document.querySelector('.quiz-container');
  $quizContainer.prepend($barRow);
  const $inRow = document.createElement('div');
  $inRow.className = 'in';
  $barRow.appendChild($inRow);
  const shuffledFour = _.shuffle(data.currentFour);
  for (let i = 0; i < 4; i++) {
    const $button = document.createElement('button');
    $button.className = 'justify-center';
    $button.textContent = allPokemonList[shuffledFour[i] - 1];
    $quizContainer.appendChild($button);
    $button.addEventListener('click', questionClick);
  }
}

function questionClick() {
  clearTimeout(tenSecondsBar);
  const $quizContainer = document.querySelector('.quiz-container');
  if (data.currentNumber === 10) {
    if (event.target.textContent === data.currentPokemon) {
      const $dots = document.querySelectorAll('.col-tenth');
      $dots[data.currentNumber - 1].textContent = '';
      const $icon = document.createElement('img');
      $icon.className = 'icon';
      $icon.setAttribute('src', 'images/pokeball.png');
      $dots[data.currentNumber - 1].appendChild($icon);
      data.correctPokemon.push({
        pokemon: data.currentPokemon,
        sprite: data.currentPokemonUrl,
        id: data.currentPokemonId
      });
    } else {
      data.wrongPokemon.push({
        pokemon: data.currentPokemon,
        sprite: data.currentPokemonUrl,
        id: data.currentPokemonId
      });
    }
    const $lastQuizImg = document.querySelector('.quiz-pokemon');
    $lastQuizImg.className = '';
    const $quizModal = document.querySelector('#quiz-modal');
    $quizModal.className = 'modal-background';
    const $quizScore = document.querySelector('.quiz-score');
    if (data.correctPokemon.length === 10) {
      $finalModalText.textContent = 'Perfect!';
    } else if (data.correctPokemon.length >= 7) {
      $finalModalText.textContent = 'Amazing!';
    } else if (data.correctPokemon.length >= 4) {
      $finalModalText.textContent = 'Not bad, but you can do better!';
    } else {
      $finalModalText.textContent = "Can't hurt to try again!";
    }
    $quizScore.textContent = 'Score: ' + data.correctPokemon.length + '/10';
    clearTimeout(tenSecondsBar);
    data.pastGames.push({
      trainerName: data.trainerName,
      correctPokemon: data.correctPokemon,
      wrongPokemon: data.wrongPokemon,
      hardMode: data.hardMode
    });
  } else if (event.target.textContent === data.currentPokemon) {
    const $navH1 = document.querySelector('.navh1');
    const $dots = document.querySelectorAll('.col-tenth');
    $dots[data.currentNumber - 1].textContent = '';
    const $icon = document.createElement('img');
    $icon.className = 'icon';
    $icon.setAttribute('src', 'images/pokeball.png');
    $dots[data.currentNumber - 1].appendChild($icon);
    data.correctPokemon.push({
      pokemon: data.currentPokemon,
      sprite: data.currentPokemonUrl,
      id: data.currentPokemonId
    });
    data.currentNumber++;
    $navH1.textContent = 'Trainer:' + data.trainerName + '  | Question ' + data.currentNumber;
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture();
  } else {
    $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push({
      pokemon: data.currentPokemon,
      sprite: data.currentPokemonUrl,
      id: data.currentPokemonId
    });
    data.currentNumber++;
    $navH1.textContent = 'Trainer:' + data.trainerName + '  | Question ' + data.currentNumber;
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture();
  }
}

function resetQuiz() {
  data.currentNumber = 1;
  data.correctPokemon = [];
  data.wrongPokemon = [];
  data.currentPokemon = null;
  data.currentFour = [];
  const $dots = document.querySelectorAll('.col-tenth');
  for (let i = 0; i < $dots.length; i++) {
    $dots[i].innerHTML = '<i class="fas fa-circle"></i>';
  }
  const $quizContainer = document.querySelector('.quiz-container');
  $quizContainer.remove();
  $navH1.textContent = 'Trainer:' + data.trainerName + '  | Question ' + data.currentNumber;
  $quizModal.className = 'modal-background hidden';
  createQuizContainer();
  generateFourRandomPokemonNumbers();
  getPokemonPicture();
}

function clearQuiz() {
  data.currentNumber = 1;
  data.correctPokemon = [];
  data.wrongPokemon = [];
  data.trainerName = null;
  data.currentPokemon = null;
  data.currentFour = [];
  const $dots = document.querySelectorAll('.col-tenth');
  for (let i = 0; i < $dots.length; i++) {
    $dots[i].innerHTML = '<i class="fas fa-circle"></i>';
  }
  const $quizContainer = document.querySelector('.quiz-container');
  $quizContainer.remove();
  $homePage.className = 'container';
  $quizPage.className = 'container hidden';
  $quizModal.className = 'modal-background hidden';
  $navH1.textContent = "Who's that Pokémon?";
  createQuizContainer();
  generateFourRandomPokemonNumbers();
}

function switchToHistory() {
  $homePage.className = 'container hidden';
  $pastGamesView.className = 'container';
  $body.className = 'animated-background';
  $navH2.className = 'navh2 pokemon-font';
  everyEntry();
}

function homeScreen() {
  $homePage.className = 'container';
  $pastGamesView.className = 'container hidden';
  $navH2.className = 'navh2 pokemon-font hidden';
  $body.className = 'animated-background';
  const $trainerData = document.querySelectorAll('.trainer-data');
  for (let i = 0; i < $trainerData.length; i++) {
    $trainerData[i].remove();
  }
  $pokedex.className = 'container hidden';
  $navH1.textContent = "Who's that Pokémon?";
}

function everyEntry() {
  for (let i = 0; i < data.pastGames.length; i++) {
    const renderHistory = createTrainerEntry(i);
    $pastGamesView.prepend(renderHistory);
  }
  const $trashIcons = document.querySelectorAll('.fa-trash-alt');
  for (let k = $trashIcons.length - 1; k >= 0; k--) {
    $trashIcons[k].setAttribute('Index', k);
    $trashIcons[k].addEventListener('click', function () {
      const $trainerData = document.querySelectorAll('.trainer-data');
      $trainerData[event.target.attributes.index.value].remove();
      data.pastGames.reverse().splice(parseInt(event.target.attributes.index.value), 1);
    });
  }
}

function createTrainerEntry(index) {
  const $trainerData = document.createElement('div');
  $trainerData.className = 'column-full trainer-data light-background';
  const $deleteButton = document.createElement('h1');
  $deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  $deleteButton.className = 'delete-button';
  const $trainerNameRow = document.createElement('div');
  $trainerNameRow.className = 'trainerName row justify-center';
  $trainerData.appendChild($trainerNameRow);
  const $h1Name = document.createElement('h1');
  $h1Name.textContent = 'Trainer: ' + data.pastGames[index].trainerName;
  $h1Name.className = 'pokemon-font';
  if (data.pastGames[index].hardMode === true) {
    const $h2Name = document.createElement('p');
    $h2Name.textContent = '(Hard Mode)';
    $trainerNameRow.appendChild($h2Name);
  }
  $trainerNameRow.appendChild($h1Name);
  $trainerNameRow.appendChild($deleteButton);
  const $correctPokemonRow = document.createElement('div');
  $correctPokemonRow.className = 'row justify-center';
  $trainerData.appendChild($correctPokemonRow);
  const $h1Correct = document.createElement('h1');
  $h1Correct.textContent = 'Correct Pokémon';
  $h1Correct.className = 'blue-font';
  $correctPokemonRow.appendChild($h1Correct);
  const $correctImages = document.createElement('div');
  $correctImages.className = 'mini-pokemon row';
  $trainerData.appendChild($correctImages);
  for (let j = 0; j < data.pastGames[index].correctPokemon.length; j++) {
    const $correctPokemonImage = document.createElement('div');
    $correctPokemonImage.className = 'one-fifth';
    $correctImages.appendChild($correctPokemonImage);
    const $miniPokemon = document.createElement('img');
    $miniPokemon.src = data.pastGames[index].correctPokemon[j].sprite;
    $miniPokemon.setAttribute('data-view', data.pastGames[index].correctPokemon[j].id);
    $correctPokemonImage.appendChild($miniPokemon);
    $miniPokemon.addEventListener('click', searchOldPokemon);
    const $miniPokemonTitle = document.createElement('p');
    $miniPokemonTitle.className = 'text-center mini-pokemon-title';
    $miniPokemonTitle.textContent = data.pastGames[index].correctPokemon[j].pokemon;
    $correctPokemonImage.appendChild($miniPokemonTitle);
  }
  const $incorrectPokemonRow = document.createElement('div');
  $incorrectPokemonRow.className = 'row justify-center';
  $trainerData.appendChild($incorrectPokemonRow);
  const $h1Wrong = document.createElement('h1');
  $h1Wrong.textContent = 'Incorrect Pokémon';
  $incorrectPokemonRow.appendChild($h1Wrong);
  const $incorrectImages = document.createElement('div');
  $incorrectImages.className = 'mini-pokemon row';
  $trainerData.appendChild($incorrectImages);
  for (let k = 0; k < data.pastGames[index].wrongPokemon.length; k++) {
    const $incorrectPokemonImage = document.createElement('div');
    $incorrectPokemonImage.className = 'one-fifth';
    $incorrectImages.appendChild($incorrectPokemonImage);
    const $miniWrongPokemon = document.createElement('img');
    $miniWrongPokemon.src = data.pastGames[index].wrongPokemon[k].sprite;
    $miniWrongPokemon.setAttribute('data-view', data.pastGames[index].wrongPokemon[k].id);
    $incorrectPokemonImage.appendChild($miniWrongPokemon);
    $miniWrongPokemon.addEventListener('click', searchOldPokemon);
    const $miniWrongPokemonTitle = document.createElement('p');
    $miniWrongPokemonTitle.className = 'text-center mini-pokemon-title';
    $miniWrongPokemonTitle.textContent = data.pastGames[index].wrongPokemon[k].pokemon;
    $incorrectPokemonImage.appendChild($miniWrongPokemonTitle);
  }
  return $trainerData;
}

function switchPokedex() {
  $homePage.className = 'container hidden';
  $pokedex.className = 'container rotom';
  $body.className = 'rotom';
  $navH2.className = 'navh2 pokemon-font';
  $navH1.textContent = 'Pokédex';
}

function removePokedexEntry() {
  for (let i = 0; i < $pokedexImage.children.length; i++) {
    $pokedexImage.children[i].remove();
    i--;
  }
  for (let x = 0; x < $stats.children.length; x++) {
    $stats.children[x].remove();
    x--;
  }
  for (let k = 0; k < $type.children.length; k++) {
    $type.children[k].remove();
    k--;
  }
}

function searchPokemon() {
  if ($pokedexSearch.value.includes(' ')) {
    getPokedexPicture($pokedexSearch.value.toLowerCase().replace(' ', '-'));
  } else if ($pokedexSearch.value.toLowerCase() === 'nidoran') {
    $nidoranModal.className = 'modal-background';
  } else {
    getPokedexPicture($pokedexSearch.value.toLowerCase());
  }
  removePokedexEntry();
}

function searchOldPokemon() {
  removePokedexEntry();
  $pastGamesView.className = 'container hidden';
  $pokedex.className = 'container rotom';
  $pokedexSearch.value = event.target.attributes['data-view'].value;
  $body.className = 'rotom';
  searchPokemon();
}

function getPokedexPicture(name) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + name);
  xhr.responseType = 'json';
  const $pokedexLoading = document.createElement('div');
  $pokedexLoading.className = 'lds-dual-ring pokedexLoad';
  $pokedexScreen.appendChild($pokedexLoading);
  xhr.addEventListener('load', handlePokedexResponseData);
  xhr.send();
}

function handlePokedexResponseData(event) {
  if (event.target.response === null) {
    $errorModal.className = 'modal-background';
  }
  appendPokedex(event.target.response);
}

function appendPokedex(stats) {
  const $pokedexLoad = document.querySelector('.pokedexLoad');
  $pokedexLoad.remove();
  const $img = document.createElement('img');
  if (stats.sprites) {
    $img.setAttribute('src', stats.sprites.other['official-artwork'].front_default);
  }
  $img.className = 'pokedex-img';
  $pokedexImage.appendChild($img);
  const $nameAndNumber = document.createElement('h1');
  if (stats.name === 'nidoran-m' || stats.name === 'nidoran-f') {
    $nameAndNumber.textContent = 'Nidoran' + ' (#' + stats.id + ')';
  } else if (stats.name.includes('-')) {
    const noSpaces = stats.name.split('-');
    const answer = [];
    for (let i = 0; i < noSpaces.length; i++) {
      answer.push(noSpaces[i].charAt(0).toUpperCase() + noSpaces[i].slice(1));
    }
    const upperCasedPokemon = answer.join('-');
    $nameAndNumber.textContent = upperCasedPokemon + ' (#' + stats.id + ')';
  } else {
    $nameAndNumber.textContent = stats.name.charAt(0).toUpperCase() + stats.name.slice(1) + ' (#' + stats.id + ')';
  }
  $nameAndNumber.className = 'pokedexh1';
  $pokedexImage.appendChild($nameAndNumber);
  const $ul = document.createElement('ul');
  for (let x = 0; x < stats.stats.length; x++) {
    const $li = document.createElement('li');
    $li.textContent = stats.stats[x].base_stat + ' - ' + stats.stats[x].stat.name;
    $ul.appendChild($li);
  }
  for (let z = 0; z < stats.types.length; z++) {
    const $h1 = document.createElement('h1');
    const $divH1 = document.createElement('div');
    $divH1.className = 'type-color ' + stats.types[z].type.name;
    $h1.textContent = stats.types[z].type.name;
    $divH1.appendChild($h1);
    $type.appendChild($divH1);
  }
  $stats.appendChild($ul);
}

function searchNidoran() {
  $nidoranModal.className = 'modal-background hidden';
  if (event.target.textContent === 'Male') {
    getPokedexPicture('nidoran-m');
  } else {
    getPokedexPicture('nidoran-f');
  }
}

function errorModal() {
  $errorModal.className = 'modal-background hidden';
}

function instructions() {
  if ($instructions.className.includes('hidden')) {
    $instructions.className = 'modal-background';
  } else {
    $instructions.className = 'modal-background hidden';
  }
}

function changeDifficulty() {
  if (data.hardMode === false) {
    $logo.setAttribute('src', 'images/master_ball.png');
    $body.className = 'faster-animated-background';
    $navH1.textContent = "Who's that Pokémon?  (HARD MODE)";
    data.hardMode = true;
  } else {
    $logo.setAttribute('src', 'images/pokeball.png');
    $body.className = 'animated-background';
    $navH1.textContent = "Who's that Pokémon?";
    data.hardMode = false;
  }
}
