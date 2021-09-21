var $navH2 = document.querySelector('.navh2')
var $navH1 = document.querySelector('.navh1')
$navH2.addEventListener('click', resetQuiz)
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
function startQuiz(){
    $startModal.className = "modal-background hidden"
    $homePage.className = "container hidden"
    $quizPage.className = "container"
    $body.className = "blueBackground"
    $navH2.className = "navH2 pokemon-font"
    $navH1.textContent = "Question " + data.currentNumber;
    createQuizQuestion();
}

function resetQuiz(){
    var $quizContainer = document.querySelector('.quizContainer');
    $quizContainer.remove();
    $homePage.className = "container";
    $quizPage.className = "container hidden"
    $body.className = "";
    $navH1.textContent = "Pokemon Quiz Game";
    $navH2.className = "navH2 pokemon-font hidden"
    data.currentNumber = 1;
}