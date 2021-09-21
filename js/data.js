/* exported data */

var dataModel = {
    questionNumber: 1,
    currentPokemonArray: [],
    trainerName: null,
    pastMatches: [],
    allPokemonFound: [],
}

var fourNumbers = [];
var randomInteger = Math.floor(Math.random() * 4) //Minimum 0,1,2,3 index

function generateFour() {
  for (var i = 0;; i++) {
    //Skipping a condition to keep running
    var random = Math.floor(Math.random() * (151 - 1 + 1) + 1);
    if (fourNumbers.includes(random)) {
      continue;
    } else {
      fourNumbers.push(random);
    }
    //If length is 4, BREAK
    if (fourNumbers.length === 4) {
      break;
    }
  }
  console.log('List of four Pokemon:', fourNumbers)
  // console.log('random index from Array:', (fourNumbers[randomInteger]))
}
generateFour() //Generates 4 different numbers inside our fourNumbers array;


function getPokemonPicture() {
  var pokemonPicture = new XMLHttpRequest();
  pokemonPicture.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + fourNumbers[randomInteger]);
  pokemonPicture.responseType = 'json';
  pokemonPicture.addEventListener('load', function () {
    var sprite = pokemonPicture.response.sprites.other['official-artwork'].front_default
    var $img = document.createElement('img')
    $img.setAttribute('src', sprite)
    $img.className = 'silhouette'
    $quizImage.appendChild($img);
    //Update dataModel
    dataModel.currentPokemon = pokemonPicture.response.name.charAt(0).toUpperCase() + pokemonPicture.response.name.slice(1);
  });
  pokemonPicture.send();
}

getPokemonPicture(); //Generates Pokemon picture for 1 of the 4. 
var $quizImage = document.querySelector('.quizImage')

var shuffledFourNumbers = _.shuffle(fourNumbers); //Shuffle the 4 buttons
console.log("Shuffled fourNumbers:", shuffledFourNumbers)

function getPokemonNames() { //This function picks the first index and makes a button
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + shuffledFourNumbers[0]);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    // console.log(xhr.status); //Want 200
    var $button = document.createElement('button')
    $button.className = "white-button"
    $button.textContent = xhr.response.name.charAt(0).toUpperCase() + xhr.response.name.slice(1);
    $quizImage.appendChild($button);
  });
  xhr.send();
  shuffledFourNumbers.splice(0, 1);
}

//Buttons will appear after img load (sometimes img takes long)
// setTimeout(function(){
// for (var i = 0; i < 4; i++){
//     getPokemonNames();
// }
// }, 500)


// Ajax call 1
function getPokemonName_1() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          resolve(this.responseText);
        } else {
          reject('Call 1 Failed');
        }
      }
    };
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + shuffledFourNumbers[0]);
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
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + shuffledFourNumbers[1]);
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
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + shuffledFourNumbers[2]);
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
          reject('Call 1 Failed');
        }
      }
    };
    xhr.open('GET', 'https://pokeapi.co/api/v2/pokemon/' + shuffledFourNumbers[3]);
    xhr.send();
  })
}

Promise.all([getPokemonName_1(), getPokemonName_2(), getPokemonName_3(), getPokemonName_4()]).then(function (values) {
  //All Ajax requests are finished
  console.log(values);
  for (var i = 0; i < 4; i++) {
    getPokemonNames();
  }
}).catch(function (reason) {
  console.log(reason);
})