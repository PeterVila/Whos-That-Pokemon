// var $navH2 = document.querySelector('.navh2')
var $navH1 = document.querySelector('.navh1')
// $navH2.addEventListener('click', resetQuiz)
var $body = document.querySelector('body');
var $startQuiz = document.querySelector('#start');
$startQuiz.addEventListener('click', startQuizModal);
var $startModal = document.querySelector('.modal-background')
function startQuizModal(){
    $startModal.className = "modal-background"
}
var $cancelButton = document.querySelector('#cancel');
var $submitButton = document.querySelector('#submit');
$cancelButton.addEventListener('click', hideQuizModal);
function hideQuizModal(){
    $startModal.className = "modal-background hidden"
}
$submitButton.addEventListener('click', startQuiz);
var $homePage = document.querySelector('div[data-view="home"]')
var $quizPage = document.querySelector('div[data-view="quiz"]')
var $input = document.querySelector('input');
function startQuiz(){
    data.trainerName = $input.value;
    $input.value = ""; //Reset input;
    $startModal.className = "modal-background hidden"
    $homePage.className = "container hidden"
    $quizPage.className = "container"
    $body.className = "blueBackground"
    // $navH2.className = "navH2 pokemon-font"
    $navH1.textContent = "Question " + data.currentNumber;
    createQuizQuestion();
    console.log('Data model at start:', data)
}

//Reset Quiz?
function resetQuiz(){
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

function generateFour() {
  data.currentFour = [];
  for (var i = 0;; i++) {
    var random = Math.floor(Math.random() * (151 - 1 + 1) + 1);
    if (data.currentFour.includes(random)) {
      continue;
    } else {
      data.currentFour.push(random);
    }
    if (data.currentFour.length === 4) {
      break;
    }
  }
  console.log('List of four Pokemon:', data.currentFour)
}
generateFour() //Array of 4 numbers, we want to reset this later.
var shuffledFour = _.shuffle(data.currentFour);
console.log("shuffledFour:", shuffledFour);

function getPokemonName_1() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[0]);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          resolve(this.responseText);
        } else {
          reject('Call 1 Failed');
        }
      }
    };
    xhr.send();
  })
}

function getPokemonName_2() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          resolve(this.responseText)
        } else {
          reject('Call 2 Failed');
        }
      }
    };
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[1]);
    xhr.send();
  })
}

function getPokemonName_3() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          resolve(this.responseText)
        } else {
          reject('Call 3 Failed');
        }
      }
    };
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[2]);
    xhr.send();
  })
}

function getPokemonName_4() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          resolve(this.responseText)
        } else {
          reject('Call 4 Failed');
        }
      }
    };
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + data.currentFour[3]);
    xhr.send();
  })
}

function createQuizQuestion() {
  Promise.all([getPokemonName_1(), getPokemonName_2(), getPokemonName_3(), getPokemonName_4()]).then(function (values) {
    //Appending random Image to body
    var randomInteger = Math.floor(Math.random() * 4)
    console.log(shuffledFour[randomInteger])
    var $quizDiv = document.querySelector('#quiz');
    var $quizContainer = document.createElement('div');
    $quizContainer.className = "quizContainer row justify-center"
    $quizDiv.appendChild($quizContainer);
    var $img = document.createElement('img');
    $img.setAttribute('src', JSON.parse(values[randomInteger]).sprites.other['official-artwork'].front_default)
    $quizContainer.appendChild($img);
    $img.addEventListener('load', function () {
      //BAR LOAD 
      var $barRow = document.createElement('div');
      $barRow.className = "bar";
      $quizContainer.prepend($barRow);
      var $inRow = document.createElement('div');
      $inRow.className = "in";
      $barRow.appendChild($inRow);
      //QUERYING FOR DOTS
      var $dots = document.querySelectorAll('.col-tenth')
      console.log($dots);
      //SET TIMEOUT, 
      var timeBar = setTimeout(myTimer, 10000)

      function myTimer() {
        $quizContainer.remove();
        console.log('NEXT QUESTION, remake DOM');
        var $navH1 = document.querySelector('.navh1');
        data.wrongPokemon.push(data.currentPokemon);
        data.currentNumber++;
        $navH1.textContent = "Question " + data.currentNumber
        generateFour();
        createQuizQuestion();
        console.log(data);
      }
      //ADDING FUNCTIONALITY TO QUIZ BUTTONS
      for (var i = 0; i < 4; i++) {
        var $button = document.createElement('button')
        $button.className = "white-button justify-center";
        $button.textContent = JSON.parse(values[i]).name;
        $quizContainer.appendChild($button)
        $button.addEventListener('click', function () {
          clearTimeout(timeBar);
          console.log("event.target:", event.target.textContent)
          if (data.currentNumber === 10) {
            alert('goodjob');
          } else if (event.target.textContent === data.currentPokemon) {
            //CORRECT ANSWERS
            console.log('NEXT QUESTION, remake DOM');
            var $navH1 = document.querySelector('.navh1');
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
            generateFour();
            createQuizQuestion();
            console.log(data);
          } else if (data.currentNumber === 10) {
            //MODAL WINDOW APPEARS HERE
            alert('stop it stepbro')
          } else {
            //WRONG ANSWERS
            console.log('NEXT QUESTION, remake DOM');
            var $navH1 = document.querySelector('.navh1');
            data.wrongPokemon.push(data.currentPokemon)
            data.currentNumber++;
            $navH1.textContent = "Question " + data.currentNumber
            $quizContainer.remove();
            generateFour();
            createQuizQuestion();
            console.log(data);
          }
        })
      }
    })
    data.currentPokemon = JSON.parse(values[randomInteger]).name
  }).catch(function (reason) {
    console.log(reason);
  })
}
