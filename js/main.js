var $navH1 = document.querySelector('.navh1') //Top left header
var $body = document.querySelector('body');
var $startQuiz = document.querySelector('#start');
$startQuiz.addEventListener('click', startQuizModal);
var $startModal = document.querySelector('.modal-background')
function startQuizModal() {
  $startModal.className = "modal-background"
}

var $cancelButton = document.querySelector('#cancel');
$cancelButton.addEventListener('click', hideQuizModal);
function hideQuizModal() {
  $startModal.className = "modal-background hidden"
}

var $submitButton = document.querySelector('#submit');
$submitButton.addEventListener('click', startQuiz);
var $homePage = document.querySelector('div[data-view="home"]')
var $quizPage = document.querySelector('div[data-view="quiz"]')
var $input = document.querySelector('input');
function startQuiz() {
  data.trainerName = $input.value;
  $input.value = "";
  $startModal.className = "modal-background hidden"
  $homePage.className = "container hidden"
  $quizPage.className = "container"
  $body.className = "blueBackground"
  $navH1.textContent = "Question " + data.currentNumber;
  getPokemonPicture()
  createQuizContainer();
}

//Reset Quiz? Haven't added button for this yet.
function resetQuiz() {
  console.log('works');
  var $quizContainer = document.querySelector('.quizContainer');
  $quizContainer.remove();
  $homePage.className = "container";
  $quizPage.className = "container hidden"
  $body.className = "";
  $navH1.textContent = "Pokemon Quiz Game";
  $navH2.className = "navH2 pokemon-font hidden"
  data.currentNumber = 1;
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
  // console.log('List of four Pokemon:', data.currentFour)
  data.currentPokemon = allPokemonList[data.currentFour[0] - 1] //Subtract 1
}
generateFourRandomPokemonNumbers() //Array of 4 numbers, we want to reset this later.

function getPokemonPicture() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[0]);
  xhr.responseType = 'json';
  xhr.addEventListener('load', handleResponseData);
  xhr.send();
}

function handleResponseData(event) {
  appendPokemonPicture(event.target.response.sprites.other['official-artwork'].front_default)
}

var tenSecondsBar = null;
function appendPokemonPicture(sprite) {
  var $img = document.createElement('img')
  $img.setAttribute('src', sprite)
  $img.className = 'black'
  var $quizContainer = document.querySelector('.quizContainer')
  $quizContainer.appendChild($img);
  $img.addEventListener('load', questionsAndTime)
  //Start the quizTimers as the animation bar loads
  tenSecondsBar = setTimeout(quizTimer, 10000)
}
function createQuizContainer() {
  var $quizDiv = document.querySelector('#quiz');
  var $quizContainer = document.createElement('div');
  $quizContainer.className = "quizContainer row justify-center"
  $quizDiv.appendChild($quizContainer);
}

function quizTimer() {
  var $navH1 = document.querySelector('.navh1');
  data.wrongPokemon.push(data.currentPokemon)
  data.currentNumber++;
  $navH1.textContent = "Question " + data.currentNumber
  var $quizContainer = document.querySelector('.quizContainer');
  $quizContainer.remove();
  createQuizContainer();
  generateFourRandomPokemonNumbers();
  getPokemonPicture()
  console.log(data);
}

function questionsAndTime() {
  var $barRow = document.createElement('div');
  $barRow.className = "bar";
  var $quizContainer = document.querySelector('.quizContainer');
  $quizContainer.prepend($barRow);
  var $inRow = document.createElement('div');
  $inRow.className = "in";
  $barRow.appendChild($inRow);
  var shuffledFour = _.shuffle(data.currentFour);
  for (var i = 0; i < 4; i++) {
    var $button = document.createElement('button');
    $button.className = "white-button justify-center";
    $button.textContent = allPokemonList[shuffledFour[i] - 1]
    $quizContainer.appendChild($button);
    $button.addEventListener('click', questionClick)
  }
}

function questionClick() {
  clearTimeout(tenSecondsBar);
  var $quizContainer = document.querySelector('.quizContainer');
  if (data.currentNumber === 10) {
    var $quizModal = document.querySelector('#quizModal')
    $quizModal.className = "modal-background";
    var $quizScore = document.querySelector('.quizScore');
    $quizScore.textContent = "Score: " + data.correctPokemon.length + "/10"
    clearTimeout(tenSecondsBar);

    //Checks
    if (event.target.textContent === data.currentPokemon) {
      var $dots = document.querySelectorAll('.col-tenth')
      $dots[data.currentNumber - 1].textContent = ""
      var $icon = document.createElement('img');
      $icon.className = "icon"
      $icon.setAttribute('src', 'images/pokeball.png')
      $dots[data.currentNumber - 1].appendChild($icon)
      data.correctPokemon.push(data.currentPokemon);
    } else {
      data.wrongPokemon.push(data.currentPokemon)
    }
  } else if (event.target.textContent === data.currentPokemon) {
    var $navH1 = document.querySelector('.navh1');
    var $dots = document.querySelectorAll('.col-tenth')
    $dots[data.currentNumber - 1].textContent = ""
    var $icon = document.createElement('img');
    $icon.className = "icon"
    $icon.setAttribute('src', 'images/pokeball.png')
    $dots[data.currentNumber - 1].appendChild($icon)
    //Push current pokemon
    data.correctPokemon.push(data.currentPokemon);
    data.currentNumber++;
    $navH1.textContent = "Question " + data.currentNumber
    $quizContainer.remove();
    createQuizContainer()
    generateFourRandomPokemonNumbers();
    getPokemonPicture();
    console.log(data);
  } else {
    //WRONG ANSWERS
    var $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push(data.currentPokemon)
    data.currentNumber++;
    $navH1.textContent = "Question " + data.currentNumber
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture()
    console.log(data);
  }
}
