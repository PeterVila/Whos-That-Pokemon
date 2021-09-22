var data = {
  currentNumber: 1,
  currentPokemon: null,
  trainerName: null,
  currentFour: [],
  correctPokemon: [],
  wrongPokemon:[],
  pastGames: [],
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

function createQuizQuestion(){
  Promise.all([getPokemonName_1(), getPokemonName_2(), getPokemonName_3(), getPokemonName_4()]).then(function (values) {
    var randomInteger = Math.floor(Math.random() * 4)
    console.log(shuffledFour[randomInteger])
    //Appending random Image to body
    var $quizDiv = document.querySelector('#quiz');
    var $quizContainer = document.createElement('div');
    $quizContainer.className = "quizContainer row justify-center"
    $quizDiv.appendChild($quizContainer);
    var $img = document.createElement('img');
    $img.setAttribute('src', JSON.parse(values[randomInteger]).sprites.other['official-artwork'].front_default)
    $quizContainer.appendChild($img);
    $img.addEventListener('load', function(){
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


