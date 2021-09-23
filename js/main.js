var $navH1 = document.querySelector('.navh1') //Top left header
var $navH2 = document.querySelector('.navh2');
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

var $submitButton = document.querySelector('form');
$submitButton.addEventListener('submit', startQuiz);
var $homePage = document.querySelector('div[data-view="home"]')
var $quizPage = document.querySelector('div[data-view="quiz"]')
var $input = document.querySelector('input');
function startQuiz(e) {
  e.preventDefault()
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

var $quizModal = document.querySelector('#quizModal')

function quizTimer() {
  if (data.currentNumber === 10){
    data.wrongPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    $quizModal.className = "modal-background";
    var $quizScore = document.querySelector('.quizScore');
    $quizScore.textContent = "Score: " + data.correctPokemon.length + "/10"
    clearTimeout(tenSecondsBar);
    //Output data.name, correctPokemon and wrongPokemon
    data.pastGames.push({
      'trainerName': data.trainerName,
      'correctPokemon': data.currentPokemon,
      'wrongPokemon': data.wrongPokemon
    })
  } else {
    var $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    data.currentNumber++;
    $navH1.textContent = "Question " + data.currentNumber
    var $quizContainer = document.querySelector('.quizContainer');
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture()
    console.log(data);
  }
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
    var $quizModal = document.querySelector('#quizModal')
    $quizModal.className = "modal-background";
    var $quizScore = document.querySelector('.quizScore');
    $quizScore.textContent = "Score: " + data.correctPokemon.length + "/10"
    clearTimeout(tenSecondsBar);
    //Output data.name, correctPokemon and wrongPokemon
    data.pastGames.push({
      'trainerName': data.trainerName,
      'correctPokemon': data.correctPokemon,
      'wrongPokemon': data.wrongPokemon,
    }) 
  } else if (event.target.textContent === data.currentPokemon) {
    var $navH1 = document.querySelector('.navh1');
    var $dots = document.querySelectorAll('.col-tenth')
    $dots[data.currentNumber - 1].textContent = ""
    var $icon = document.createElement('img');
    $icon.className = "icon"
    $icon.setAttribute('src', 'images/pokeball.png')
    $dots[data.currentNumber - 1].appendChild($icon)
    //Push current pokemon
    data.correctPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
    })
    data.currentNumber++;
    $navH1.textContent = "Question " + data.currentNumber
    $quizContainer.remove();
    createQuizContainer()
    generateFourRandomPokemonNumbers();
    getPokemonPicture();
  } else {
    //WRONG ANSWERS
    var $navH1 = document.querySelector('.navh1');
    data.wrongPokemon.push({
      'pokemon': data.currentPokemon,
      'sprite': data.currentPokemonUrl
  })
    data.currentNumber++;
    $navH1.textContent = "Question " + data.currentNumber
    $quizContainer.remove();
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture()
  }
}

var $retry = document.querySelector('#retry')
var $home = document.querySelector('#home');
//Both buttons listen to click and reset the data object but first saves the result.

$retry.addEventListener('click', resetQuiz)
function resetQuiz(){
    //reset data to default
    data.currentNumber = 1;
    data.correctPokemon = [];
    data.wrongPokemon = [];
    var $dots = document.querySelectorAll('.col-tenth')
    for (var i = 0; i < $dots.length; i++){
      $dots[i].innerHTML = '<i class="fas fa-circle"></i>'
    }
    var $quizContainer = document.querySelector('.quizContainer')
    $quizContainer.remove();
    $navH1.textContent = "Question " + data.currentNumber;
    $quizModal.className = "modal-background hidden"
    createQuizContainer();
    generateFourRandomPokemonNumbers();
    getPokemonPicture()
}

$home.addEventListener('click', clearQuiz);
function clearQuiz(){
    data.currentNumber = 1;
    data.correctPokemon = [];
    data.wrongPokemon = [];
    data.trainerName = null;
    var $dots = document.querySelectorAll('.col-tenth')
    for (var i = 0; i < $dots.length; i++) {
      $dots[i].innerHTML = '<i class="fas fa-circle"></i>'
    }
    var $quizContainer = document.querySelector('.quizContainer')
    $quizContainer.remove();
    $homePage.className = "container"
    $quizPage.className = "container hidden"
    $quizModal.className = "modal-background hidden"
    $body.className = ""
    $navH1.textContent = "Pokemon Quiz Game";
}


// PLAY HISTORYY
var $playHistoryButton = document.querySelector('#playHistory');
$playHistoryButton.addEventListener('click', switchToHistory)
var $pastGamesView = document.querySelector('#pastGames');
function switchToHistory(){
  $homePage.className = "container hidden"
  $pastGamesView.className = "container"
  $body.className = "blueBackground"
  $navH2.className = "navh2 pokemon-font"
  createTrainerEntry();
}
$navH2.addEventListener('click', homeScreen)
function homeScreen(){
  $homePage.className = "container";
  $pastGamesView.className = "container hidden";
  $navH2.className = "navh2 pokemon-font hidden"
  $body.className = ""
}

function createTrainerEntry(){
  for (var i = 0; i < data.pastGames.length; i++){
    var $trainerData = document.createElement('div');
    $trainerData.className = "column-full trainerData"
    $pastGamesView.appendChild($trainerData);
    var $trainerNameRow = document.createElement('div');
    $trainerNameRow.className = "trainerName row justify-center";
    $trainerData.appendChild($trainerNameRow);
    var $h1Name = document.createElement('h1');
    $h1Name.textContent = data.pastGames[i].trainerName
    $h1Name.className = "pokemon-font"
    $trainerNameRow.appendChild($h1Name);
    $correctPokemonRow = document.createElement('div');
    $correctPokemonRow.className = "row justify-center";
    $trainerData.appendChild($correctPokemonRow);
    var $h1Correct = document.createElement('h1');
    $h1Correct.textContent = "Correct Pokemon";
    $correctPokemonRow.appendChild($h1Correct);
    var $correctImages = document.createElement('div');
    $correctImages.className = "miniPokemon row";
    $trainerData.appendChild($correctImages);
  for (var j = 0; j < data.pastGames[i].correctPokemon.length; j++) {
    var $miniPokemon = document.createElement('img');
    $miniPokemon.setAttribute('src', data.pastGames[i].correctPokemon[j].sprite)
    $correctImages.appendChild($miniPokemon);
  }
    $incorrectPokemonRow = document.createElement('div');
    $incorrectPokemonRow.className = "row justify-center";
    $trainerData.appendChild($incorrectPokemonRow);
    var $h1Wrong = document.createElement('h1');
    $h1Wrong.textContent = "Incorrect Pokemon";
    $incorrectPokemonRow.appendChild($h1Wrong);
    var $incorrectImages = document.createElement('div');
    $incorrectImages.className = "miniPokemon row";
    $trainerData.appendChild($incorrectImages);
  for (var k = 0; k < data.pastGames[i].wrongPokemon.length; k++) {
    var $miniPokemon = document.createElement('img');
    $miniPokemon.setAttribute('src', data.pastGames[i].wrongPokemon[k].sprite)
    $incorrectImages.appendChild($miniPokemon);
  }

  }
}

/*
          div class = "column-full trainerData" >
          <
          div class = "trainerName row justify-center" >
          <
          h1 class = "pokemon-font" > Ash < /h1> <
          /div> <
          div class = "row justify-center" >
          <
          h1 > Correct Pokemon < /h1> <
          /div> <
          div class = "miniPokemon row" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          /div> <
          div class = "row justify-center" >
          <
          h1 > Incorrect Pokemon < /h1> <
          /div> <
          div class = "miniPokemon row" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          img src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/539.png"
        alt = ""
        srcset = "" >
          <
          /div> <
          /div> <
          /div>
*/