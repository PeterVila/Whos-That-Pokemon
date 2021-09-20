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