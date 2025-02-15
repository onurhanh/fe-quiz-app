const jsonFilePath = "assets/json/data.json";
const main = document.querySelector('.main');
const quizNameContainer = document.querySelector('.quiz-name-container');

let quizData = [];
let selectedQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let flag = false;

async function getQuizzes(){
  try{
    const response = await fetch(jsonFilePath);
    if(!response.ok){
      throw new Error("Veri Alınamadı.");
    }
    const data = await response.json();
    quizData = data.quizzes;
    displayMenu();
  }catch(error){
    console.log(error)
  }
}

function displayMenu(){
  const menuSubjects = document.querySelector('.menu-subjects');
  quizData.forEach(quiz => {
    menuSubjects.innerHTML += `
      <a href="#" class="menu-subject" data-quiz=${quiz.title}>
        <img class="subject-icon" src="${quiz.icon}" alt="">
        <p class="subject-name">${quiz.title}</p>
      </a>
    `
  });

  const subjects = document.querySelectorAll('.menu-subject');
  subjects.forEach(btn => btn.addEventListener('click', displayQuiz));

}

function displayQuiz(e){
  e.preventDefault();
  const subject = e.target.closest('.menu-subject');
  selectedQuiz = quizData.find(quiz => quiz.title === subject.dataset.quiz);
  quizNameContainer.innerHTML = `
    <img src="${selectedQuiz.icon}" alt="">
    <h2>${selectedQuiz.title}</h2>
  `
  renderQuestions();
}

function renderQuestions(){
  const questions = selectedQuiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const choiceLetters = ["A","B","C","D","E"];
  main.innerHTML = `
    <section class="quiz">
      <div class="question-container">
        <div>
          <p class="question-counter">Question ${currentQuestionIndex + 1} of ${questions.length}</p>
          <p class="question-content">
            ${currentQuestion.question}
          </p>
        </div>
        <div class="progress-container">
          <div class="progress"></div>
        </div>
      </div>
      <div class="answers-container">
        <div class="answers-wrapper">
          ${currentQuestion.options.map((option,index) => {
            return `
              <button class="answer-btn">
                <span class="answer-choice">${choiceLetters[index]}</span>
                <p class="answer-content">
                 
                </p>
              </button>
            `
          }).join('')}
        </div>
        <button class="submit-btn purple-btn">Submit Answer</button>
        <p class="error hidden">
          <i class="fa-regular fa-circle-xmark"></i>
          Please select an answer
        </p>
      </div>
    </section>
  `;

  const progressBar = document.querySelector('.progress');
  progressBar.style.width = `${(currentQuestionIndex + 1) * 10}%`;

  const answerContents = document.querySelectorAll('.answer-content');

  answerContents.forEach((content,index) => {
    content.textContent = currentQuestion.options[index];
  });
  const answerButtons = document.querySelectorAll('.answer-btn');
  answerButtons.forEach(btn => btn.addEventListener('click',selectQuestion));

  const submitBtn = document.querySelector('.submit-btn');
  submitBtn.addEventListener('click', (e) => submitAnswer(e,currentQuestion));
}

function selectQuestion(){
  if(flag){
    return;
  }
  const answerButtons = document.querySelectorAll('.answer-btn');
  answerButtons.forEach(btn => {
    if(btn.classList.contains('selected')){
      btn.classList.remove('selected');
    }
  });
  this.classList.add('selected');
}

function submitAnswer(e,currentQuestion){
  const selectedAnswerContent = document.querySelector('.answer-btn.selected .answer-content')?.textContent;
  const selectedAnswerBtn = document.querySelector('.answer-btn.selected');

  if(!selectedAnswerContent){
    const errorText = document.querySelector('.error');
    errorText.classList.remove('hidden');
    return;
  }

  if(!flag){
    flag = !flag;
    if(currentQuestion.answer == selectedAnswerContent){
      console.log('Cevabın Doğru');
      selectedAnswerBtn.classList.add('correct');
      selectedAnswerBtn.innerHTML += `
        <i class="fa-regular fa-circle-check"></i>
      `
      score++;
    }else{
      const answerContents = document.querySelectorAll('.answer-content');
      answerContents.forEach(content => {
        if(content.textContent === currentQuestion.answer){
          content.parentElement.innerHTML += `
            <i class="fa-regular fa-circle-check correct-answer"></i>
          `
        }
      })
      selectedAnswerBtn.classList.add('incorrect');
      selectedAnswerBtn.innerHTML += `
        <i class="fa-regular fa-circle-xmark"></i>
      `;
    }
  }

  e.target.innerText = "Next Question";
  e.target.classList.add('next');
  const nextButton = document.querySelector('.next');
  nextButton.addEventListener('click',nextQuestion);
}

function nextQuestion(){
  flag = !flag;
  if(currentQuestionIndex < selectedQuiz.questions.length - 1){
    currentQuestionIndex++;
    renderQuestions();
  }else {
    console.log('Quiz Tamamlandı. Score: ', score);
    main.innerHTML = `
      <section class="end-quiz">
        <h2 class="heading card-header">Quiz completed <span>You scored...</span></h2>
        <div>        
          <div class="card">
            <div class="quiz-name-container">
              <img src="${selectedQuiz.icon}" alt="">
              <h2>${selectedQuiz.title}</h2>
            </div>
            <span class="quiz-result">
              ${score}
            </span>
            <span class="total-questions-count">
              out of ${selectedQuiz.questions.length}
            </span>
          </div>
          <button class="purple-btn play-again-btn">Play Again</button>
        </div>
      </section>
    `;

    const playAgainBtn = document.querySelector('.play-again-btn');
    playAgainBtn.addEventListener('click',playAgain);
  }
  
}

function playAgain(){
  selectedQuiz = null;
  currentQuestionIndex = 0;
  score = 0;
  flag = false;
  createMenu();
}

function createMenu(){
  main.innerHTML = `
    <section class="menu">
      <div class="menu-info">
        <h1 class="menu-title heading">Welcome to the <span>Frontend Quiz!</span></h1>
        <p class="menu-subtitle">Pick a subject to get started.</p>
      </div>
      <div class="menu-subjects">
        
      </div>
    </section>
  `;
  displayMenu();
}


getQuizzes();