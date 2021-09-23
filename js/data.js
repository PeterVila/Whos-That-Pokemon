var data = {
  currentNumber: 1,
  currentPokemon: null,
  trainerName: null,
  currentFour: [],
  correctPokemon: [],
  wrongPokemon:[],
  pastGames: [],
}

//LocalStorage
window.addEventListener('beforeunload', logBefore);

function logBefore() {
  var pastQuizzes = JSON.stringify(data.pastGames);
  localStorage.setItem('past-quizzes', pastQuizzes);
}

var matchHistory = localStorage.getItem('past-quizzes');
if (matchHistory !== null) {
  data.pastGames = JSON.parse(matchHistory);
}