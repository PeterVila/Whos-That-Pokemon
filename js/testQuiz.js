var data = {
    currentNumber: 1,
    currentPokemon: null,
    trainerName: null,
    currentFour: [],
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
    var randomInteger = Math.floor(Math.random() * 4)
    console.log(shuffledFour[randomInteger])
    //Appending random Image to body
    var $quizDiv = document.querySelector('#quiz');
    var $quizContainer = document.createElement('div');
    $quizDiv.appendChild($quizContainer);
    var $img = document.createElement('img');
    $img.setAttribute('src', JSON.parse(values[randomInteger]).sprites.other['official-artwork'].front_default)
    $quizContainer.appendChild($img);
    data.currentPokemon = JSON.parse(values[randomInteger]).name
    //Bar load
    var $barRow = document.createElement('div');
    $barRow.className = "bar";
    $quizContainer.appendChild($barRow);
    $inRow = document.createElement('div');
    $inRow.className = "in";
    $barRow.appendChild($inRow);
 //Create 4 Buttons 

    for (var i = 0; i < 4; i++){
        var $button = document.createElement('button')
        $button.className = "white-button";
        $button.textContent = JSON.parse(values[i]).name;
        $quizContainer.appendChild($button)
        $button.addEventListener('click', function(){
            console.log("event.target:", event.target.textContent)
            if (event.target.textContent === data.currentPokemon){
                if (data.currentNumber === 10){
                    alert('nicely done')
                } else {
                    console.log('NEXT QUESTION, remake DOM');
                    $quizContainer.remove();
                    generateFour();
                    createQuizQuestion();
                    data.currentNumber++;
                    console.log(data);
                }
            }
        })
    }

  }).catch(function (reason) {
    console.log(reason);
  })
}

createQuizQuestion();