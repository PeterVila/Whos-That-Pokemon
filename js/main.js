var $navH1 = document.querySelector('.navh1');
var $navH2 = document.querySelector('.navh2');
var $body = document.querySelector('body');
var $startQuiz = document.querySelector('#start');
var $startModal = document.querySelector('.modal-background');
var $cancelButton = document.querySelector('#cancel');
var $submitButton = document.querySelector('form');
var $homePage = document.querySelector('div[data-view="home"]');
var $quizPage = document.querySelector('div[data-view="quiz"]');
var $input = document.querySelector('input');
var $placeholder = document.createElement('img');
var $quizImage = document.querySelector('.quiz-image');
var $quizModal = document.querySelector('#quiz-modal');
var $loadingIcon = document.querySelector('.lds-dual-ring')
var $retry = document.querySelector('#retry');
var $home = document.querySelector('#home');
var $finalModalText = document.querySelector('.quiz-ending-phrase');
var $playHistoryButton = document.querySelector('#play-history');
var $pastGamesView = document.querySelector('#past-games');
var $deleteModal = document.querySelector('#delete-modal');
var $deleteYes = document.querySelector('#delete-yes');
var $pokedex = document.querySelector('#pokedex');
var $homePokedex = document.querySelector('#menu-pokedex');
var $pokedexImage = document.querySelector('.pokedex-pokemon-image');
var $pokedexSearchButton = document.querySelector('.pokedex-submit');
var $pokedexSearch = document.querySelector('.pokemon-search');
var $stats = document.querySelector('.stats');
var $type = document.querySelector('.type');
var $nidoranModal = document.querySelector('#nidoran-modal');
var $maleNidoran = document.querySelector('#male');
var $femaleNidoran = document.querySelector('#female');
var $errorModal = document.querySelector('#error-modal');
var $understood = document.querySelector('#understood');
var $logo = document.querySelector('#logo');
var $howToPlayButton = document.querySelector('#how-to-play');
var $instructions = document.querySelector('#instructions')
var $closeInstructions = document.querySelector('#close-instructions');
$logo.addEventListener('click', changeDifficulty)
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
$howToPlayButton.addEventListener('click', instructions)
$closeInstructions.addEventListener('click', instructions)

function startQuizModal() {
  $startModal.className = "modal-background"
}

$cancelButton.addEventListener('click', hideQuizModal);
function hideQuizModal() {
  $startModal.className = "modal-background hidden"
}

function startQuiz(e) {
  e.preventDefault()
  data.trainerName = $input.value;
  $input.value = "";
  $startModal.className = "modal-background hidden"
  $homePage.className = "container hidden"
  $quizPage.className = "container"
  $navH1.textContent = "Trainer:" + data.trainerName + "  | Question " + data.currentNumber;
  getPokemonPicture()
  createQuizContainer();
}

function generateFourRandomPokemonNumbers() {
  data.currentFour = [];
  while (data.currentFour.length < 4) {
    var random = Math.floor(Math.random() * (allPokemonList.length - 1 + 1) + 1);
    if (data.currentFour.includes(random)) {
      continue;
    } else {
      data.currentFour.push(random);
    }
  }
  data.currentPokemon = allPokemonList[data.currentFour[0] - 1]
}
generateFourRandomPokemonNumbers()

function getPokemonPicture() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[0]);
  xhr.responseType = 'json';
  xhr.addEventListener('load', handleResponseData);
  xhr.send();
}

function handleResponseData(event) {
  appendPokemonPicture(event.target.response.sprites.other['official-artwork'].front_default)
  data.currentPokemonUrl = event.target.response.sprites.front_default
}

function appendPokemonPicture(sprite) {
  var $img = document.createElement('img')
  $img.setAttribute('src', sprite)
  if (data.hardMode === true) {
    $img.className = 'silhouette quiz-pokemon'
  } else {
    $img.className = "quiz-pokemon"
  }
  var $quizContainer = document.querySelector('.quiz-container')
  $quizContainer.appendChild($img);
  $loadingIcon.className = 'lds-dual-ring'
  $img.addEventListener('load', questionsAndTime)
  tenSecondsBar = setTimeout(quizTimer, 10000)
}

function createQuizContainer() {
  var $quizDiv = document.querySelector('#quiz');
  var $quizContainer = document.createElement('div');
  $quizContainer.className = "quiz-container row justify-center"
  $quizDiv.appendChild($quizContainer);
}

var tenSecondsBar = null;
function quizTimer() {
  if (data.currentNumber === 10) {
    data.wrongPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    $quizModal.className = "modal-background";
    var $quizScore = document.querySelector('.quiz-score');
    if (data.correctPokemon.length === 10) {
      $finalModalText.textContent = "Perfect!"
    } else if (data.correctPokemon.length >= 7) {
      $finalModalText.textContent = "Amazing!"
    } else if (data.correctPokemon.length >= 4) {
      $finalModalText.textContent = "Not bad, but you can do better!"
    } else {
      $finalModalText.textContent = "Can't hurt to try again!"
    }
    $quizScore.textContent = "Score: " + data.correctPokemon.length + "/10"
    clearTimeout(tenSecondsBar);
    data.pastGames.push({
      'trainerName': data.trainerName,
      'correctPokemon': data.currentPokemon,
      'wrongPokemon': data.wrongPokemon,
      'hardMode': data.hardMode
    })
  } else {
    var $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    data.currentNumber++;
    $navH1.textContent = "Trainer:" + data.trainerName + "  | Question " + data.currentNumber;
    var $quizContainer = document.querySelector('.quiz-container');
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture()
    console.log(data);
  }
}

function questionsAndTime() {
  $loadingIcon.className = 'lds-dual-ring hidden'
  var $barRow = document.createElement('div');
  $barRow.className = "bar";
  var $quizContainer = document.querySelector('.quiz-container');
  $quizContainer.prepend($barRow);
  var $inRow = document.createElement('div');
  $inRow.className = "in";
  $barRow.appendChild($inRow);
  var shuffledFour = _.shuffle(data.currentFour);
  for (var i = 0; i < 4; i++) {
    var $button = document.createElement('button');
    $button.className = "justify-center";
    $button.textContent = allPokemonList[shuffledFour[i] - 1]
    $quizContainer.appendChild($button);
    $button.addEventListener('click', questionClick)
  }
}

function questionClick() {
  clearTimeout(tenSecondsBar);
  var $quizContainer = document.querySelector('.quiz-container');
  if (data.currentNumber === 10) {
    if (event.target.textContent === data.currentPokemon) {
      var $dots = document.querySelectorAll('.col-tenth')
      $dots[data.currentNumber - 1].textContent = ""
      var $icon = document.createElement('img');
      $icon.className = "icon"
      $icon.setAttribute('src', 'images/pokeball.png')
      $dots[data.currentNumber - 1].appendChild($icon)
      data.correctPokemon.push({
        'pokemon': data.currentPokemon,
        'sprite': data.currentPokemonUrl
      })
    } else {
      data.wrongPokemon.push({
        'pokemon': data.currentPokemon,
        'sprite': data.currentPokemonUrl
      })
    }
    var $lastQuizImg = document.querySelector('.quiz-pokemon');
    $lastQuizImg.className = "";
    var $quizModal = document.querySelector('#quiz-modal')
    $quizModal.className = "modal-background";
    var $quizScore = document.querySelector('.quiz-score');
    if (data.correctPokemon.length === 10) {
      $finalModalText.textContent = "Perfect!"
    } else if (data.correctPokemon.length >= 7) {
      $finalModalText.textContent = "Amazing!"
    } else if (data.correctPokemon.length >= 4) {
      $finalModalText.textContent = "Not bad, but you can do better!"
    } else {
      $finalModalText.textContent = "Can't hurt to try again!"
    }
    $quizScore.textContent = "Score: " + data.correctPokemon.length + "/10"
    clearTimeout(tenSecondsBar);
    data.pastGames.push({
      'trainerName': data.trainerName,
      'correctPokemon': data.correctPokemon,
      'wrongPokemon': data.wrongPokemon,
      'hardMode': data.hardMode
    })
  } else if (event.target.textContent === data.currentPokemon) {
    var $navH1 = document.querySelector('.navh1');
    var $dots = document.querySelectorAll('.col-tenth')
    $dots[data.currentNumber - 1].textContent = ""
    var $icon = document.createElement('img');
    $icon.className = "icon"
    $icon.setAttribute('src', 'images/pokeball.png')
    $dots[data.currentNumber - 1].appendChild($icon)
    data.correctPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    data.currentNumber++;
    $navH1.textContent = "Trainer:" + data.trainerName + "  | Question " + data.currentNumber;
    $quizContainer.remove();
    createQuizContainer()
    generateFourRandomPokemonNumbers();
    getPokemonPicture();
  } else {
    var $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    data.currentNumber++;
    $navH1.textContent = "Trainer:" + data.trainerName + "  | Question " + data.currentNumber;
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture()
  }
}

function resetQuiz() {
  data.currentNumber = 1;
  data.correctPokemon = [];
  data.wrongPokemon = [];
  data.currentPokemon = null;
  data.currentFour = [];
  var $dots = document.querySelectorAll('.col-tenth')
  for (var i = 0; i < $dots.length; i++) {
    $dots[i].innerHTML = '<i class="fas fa-circle"></i>'
  }
  var $quizContainer = document.querySelector('.quiz-container')
  $quizContainer.remove();
  $navH1.textContent = "Trainer:" + data.trainerName + "  | Question " + data.currentNumber;
  $quizModal.className = "modal-background hidden"
  createQuizContainer();
  generateFourRandomPokemonNumbers();
  getPokemonPicture()
}

function clearQuiz() {
  data.currentNumber = 1;
  data.correctPokemon = [];
  data.wrongPokemon = [];
  data.trainerName = null;
  data.currentPokemon = null;
  data.currentFour = [];
  var $dots = document.querySelectorAll('.col-tenth')
  for (var i = 0; i < $dots.length; i++) {
    $dots[i].innerHTML = '<i class="fas fa-circle"></i>'
  }
  var $quizContainer = document.querySelector('.quiz-container')
  $quizContainer.remove();
  $homePage.className = "container"
  $quizPage.className = "container hidden"
  $quizModal.className = "modal-background hidden"
  $navH1.textContent = "Who's that Pokémon?"
  createQuizContainer();
  generateFourRandomPokemonNumbers();
}

function switchToHistory() {
  $homePage.className = "container hidden"
  $pastGamesView.className = "container"
  $body.className = "animated-background"
  $navH2.className = "navh2 pokemon-font"
  everyEntry();
}

function homeScreen() {
  $homePage.className = "container";
  $pastGamesView.className = "container hidden";
  $navH2.className = "navh2 pokemon-font hidden"
  $body.className = "animated-background"
  var $trainerData = document.querySelectorAll('.trainer-data');
  for (var i = 0; i < $trainerData.length; i++) {
    $trainerData[i].remove();
  }
  $pokedex.className = "container hidden"
  $navH1.textContent = "Who's that Pokémon?"
}

function everyEntry() {
  for (var i = 0; i < data.pastGames.length; i++) {
    var renderHistory = createTrainerEntry(i);
    $pastGamesView.prepend(renderHistory);
  }
  var $trashIcons = document.querySelectorAll('.fa-trash-alt');
  for (var i = $trashIcons.length - 1; i >= 0; i--) {
    $trashIcons[i].setAttribute("Index", i);
    $trashIcons[i].addEventListener('click', function () {
      var $trainerData = document.querySelectorAll('.trainer-data');
      $trainerData[event.target.attributes.index.value].remove();
      data.pastGames.reverse().splice(parseInt(event.target.attributes.index.value), 1)
    })
  }
}

function createTrainerEntry(index) {
  var $trainerData = document.createElement('div');
  $trainerData.className = "column-full trainer-data light-background"
  var $deleteButton = document.createElement('h1');
  $deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'
  $deleteButton.className = "delete-button";
  var $trainerNameRow = document.createElement('div');
  $trainerNameRow.className = "trainerName row justify-center";
  $trainerData.appendChild($trainerNameRow);
  var $h1Name = document.createElement('h1');
  $h1Name.textContent = "Trainer: " + data.pastGames[index].trainerName
  $h1Name.className = "pokemon-font"
  if (data.pastGames[index].hardMode === true) {
    var $h2Name = document.createElement('p');
    $h2Name.textContent = "(Hard Mode)"
    $trainerNameRow.appendChild($h2Name);
  }
  $trainerNameRow.appendChild($h1Name);
  $trainerNameRow.appendChild($deleteButton)
  $correctPokemonRow = document.createElement('div');
  $correctPokemonRow.className = "row justify-center";
  $trainerData.appendChild($correctPokemonRow);
  var $h1Correct = document.createElement('h1');
  $h1Correct.textContent = "Correct Pokémon";
  $h1Correct.className = "blue-font"
  $correctPokemonRow.appendChild($h1Correct);
  var $correctImages = document.createElement('div');
  $correctImages.className = "mini-pokemon row";
  $trainerData.appendChild($correctImages);
  for (var j = 0; j < data.pastGames[index].correctPokemon.length; j++) {
    var $correctPokemonImage = document.createElement('div');
    $correctPokemonImage.className = "one-fifth"
    $correctImages.appendChild($correctPokemonImage)
    var $miniPokemon = document.createElement('img');
    $miniPokemon.setAttribute('src', data.pastGames[index].correctPokemon[j].sprite)
    $correctPokemonImage.appendChild($miniPokemon);
    var $miniPokemonTitle = document.createElement('p')
    $miniPokemonTitle.className = "text-center mini-pokemon-title"
    $miniPokemonTitle.textContent = data.pastGames[index].correctPokemon[j].pokemon;
    $correctPokemonImage.appendChild($miniPokemonTitle);
  }
  $incorrectPokemonRow = document.createElement('div');
  $incorrectPokemonRow.className = "row justify-center";
  $trainerData.appendChild($incorrectPokemonRow);
  var $h1Wrong = document.createElement('h1');
  $h1Wrong.textContent = "Incorrect Pokémon";
  $incorrectPokemonRow.appendChild($h1Wrong);
  var $incorrectImages = document.createElement('div');
  $incorrectImages.className = "mini-pokemon row";
  $trainerData.appendChild($incorrectImages);
  for (var k = 0; k < data.pastGames[index].wrongPokemon.length; k++) {
    var $incorrectPokemonImage = document.createElement('div');
    $incorrectPokemonImage.className = "one-fifth"
    $incorrectImages.appendChild($incorrectPokemonImage)
    var $miniPokemon = document.createElement('img');
    $miniPokemon.setAttribute('src', data.pastGames[index].wrongPokemon[k].sprite)
    $incorrectPokemonImage.appendChild($miniPokemon);
    var $miniPokemonTitle = document.createElement('p')
    $miniPokemonTitle.className = "text-center mini-pokemon-title"

    $miniPokemonTitle.textContent = data.pastGames[index].wrongPokemon[k].pokemon;
    $incorrectPokemonImage.appendChild($miniPokemonTitle);
  }
  return $trainerData;
}

function switchPokedex() {
  $homePage.className = "container hidden"
  $pokedex.className = "container rotom"
  $body.className = "rotom"
  $navH2.className = "navh2 pokemon-font"
  $navH1.textContent = "Pokédex";
}

function searchPokemon() {
  if ($pokedexImage.childElementCount > 0) {
    $pokedexImage.lastChild.remove();
    $pokedexImage.firstChild.remove();
    $stats.firstElementChild.remove();
    $type.firstElementChild.remove();
  }
  if ($pokedexSearch.value.includes(' ')) {
    getPokedexPicture($pokedexSearch.value.toLowerCase().replace(' ', '-'));
  } else if ($pokedexSearch.value.toLowerCase() === 'nidoran') {
    $nidoranModal.className = "modal-background"
  } else {
    getPokedexPicture($pokedexSearch.value.toLowerCase());
  }
}

function getPokedexPicture(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + name);
  xhr.responseType = 'json';
  xhr.addEventListener('load', handlePokedexResponseData);
  xhr.send();
}

function handlePokedexResponseData(event) {
  if (event.target.response === null){
    $errorModal.className = "modal-background"
  }
  appendPokedex(event.target.response)
}

function appendPokedex(stats) {
  var $img = document.createElement('img')
  $img.setAttribute('src', stats.sprites.other['official-artwork'].front_default)
  $img.className = 'pokedex-img'
  $pokedexImage.appendChild($img);
  var $nameAndNumber = document.createElement('h1');
  if (stats.name === "nidoran-m" || stats.name === "nidoran-f") {
    $nameAndNumber.textContent = 'Nidoran' + " (#" + stats.id + ")"
  } else if (stats.name.includes("-")) {
    var noSpaces = stats.name.split('-')
    var answer = [];
    for (var i = 0; i < noSpaces.length; i++) {
      answer.push(noSpaces[i].charAt(0).toUpperCase() + noSpaces[i].slice(1));
    }
    var upperCasedPokemon = answer.join('-')
    $nameAndNumber.textContent = upperCasedPokemon + " (#" + stats.id + ")"
  } else {
    $nameAndNumber.textContent = stats.name.charAt(0).toUpperCase() + stats.name.slice(1) + " (#" + stats.id + ")"
  }
  $nameAndNumber.className = "pokedexh1"
  $pokedexImage.appendChild($nameAndNumber)
  var $ul = document.createElement('ul');
  for (var i = 0; i < stats.stats.length; i++) {
    var $li = document.createElement('li');
    $li.textContent = stats.stats[i].base_stat + " " + stats.stats[i].stat.name;
    $ul.appendChild($li);
  }
  for (var i = 0; i < stats.types.length; i++) {
    var $h1 = document.createElement('h1');
    var $divH1 = document.createElement('div');
    $divH1.className = "type-color " + stats.types[i].type.name
    $h1.textContent = stats.types[i].type.name;
    $divH1.appendChild($h1)
    $type.appendChild($divH1)
  }
  $stats.appendChild($ul);
}

function searchNidoran() {
  $nidoranModal.className = "modal-background hidden"
  if (event.target.textContent === "Male") {
    getPokedexPicture('nidoran-m');
  } else {
    getPokedexPicture('nidoran-f');
  }
}

function errorModal() {
  $errorModal.className = "modal-background hidden"
}

function instructions() {
  if ($instructions.className.includes('hidden')){
    $instructions.className = "modal-background"
  } else {
    $instructions.className = "modal-background hidden";
  }
}

function changeDifficulty() {
  if (data.hardMode === false) {
    $logo.setAttribute('src', 'images/master_ball.png');
    $body.className = "faster-animated-background";
    $navH1.textContent = "Who's that Pokémon?  (HARD MODE)";
    data.hardMode = true;
  } else {
    $logo.setAttribute('src', 'images/pokeball.png');
    $body.className = "animated-background";
    $navH1.textContent = "Who's that Pokémon?";
    data.hardMode = false;
  }
}