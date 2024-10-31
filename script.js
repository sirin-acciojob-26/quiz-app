let quizData = null;

document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("data.json");
    const data = await res.json();
    quizData = data;
    initSections();
});

const initSections = () => {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
        section.addEventListener("click", () => {
            const sectionNumber = parseInt(section.getAttribute("data-section"));
            startQuiz(sectionNumber);
        });
    });
};

const startQuiz = (index) => {
    const currentQuestions = quizData.sections[index].questions;
    shuffleArray(currentQuestions);
    let score = 0;
    let currentQuestionIndex = 0;
    let answerSelected = false;

    const quizContainerHTML =  document.getElementById("quizContainer");
    quizContainerHTML.style.display = "none";
    const questionContainerHTML = document.getElementById("questionContainer");
    questionContainerHTML.style.display = "block";
    questionContainerHTML.innerHTML = `
        <p id="score">Score: 0</p>
        <div id="question"></div>
        <div id="options"></div>
        <button id="nextBtn">Next</button>
    `;

    const showQuestion = () => {
        const question = currentQuestions[currentQuestionIndex];
        const questionHTML = document.getElementById("question");
        const optionsHTML = document.getElementById("options");

        questionHTML.textContent = question.question;
        optionsHTML.innerHTML = "";

        if (question.questionType === "mcq") {
            question.options.forEach((option) => {
                const optionHTML = document.createElement("div");
                optionHTML.textContent = option;
                optionHTML.addEventListener("click", () => {
                    if (!answerSelected) {
                        answerSelected = true;
                        optionHTML.classList.add('selected');
                        checkAnswer(option, question.answer);
                    }
                });
                optionsHTML.appendChild(optionHTML);
            });
        }else{
            const inputHTML = document.createElement('input');
            inputHTML.type = question.questionType === 'number' ? 'number' : 'text';
            const submitButton = document.createElement("button");
            submitButton.textContent = "Submit Answer";
            submitButton.classList.add('submitAnswer');

            submitButton.onclick = () => {
                if (!answerSelected) {
                    answerSelected = true;
                    checkAnswer(inputHTML.value.toString(), question.answer.toString());
                }
            }
            optionsHTML.appendChild(inputHTML);
            optionsHTML.appendChild(submitButton);
        }
    };

    const checkAnswer = (givenAnswer, correctAnswer) => {
        const feedbackHTML = document.createElement("div");
        feedbackHTML.id = "feedback";
        if (givenAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score++;
            feedbackHTML.textContent = "Correct!";
            feedbackHTML.style.color = 'green';
        } else {
            feedbackHTML.textContent = `Wrong. Correct answer: ${correctAnswer}`;
            feedbackHTML.style.color = 'red';
        }
        const optionsHTML = document.getElementById("options");
        optionsHTML.appendChild(feedbackHTML);
        updateScore(score);
    }

    showQuestion();

    const endQuiz = () => {
        questionContainerHTML.innerHTML = `
            <h1>Quiz Completed!</h1>
            <p>Your final score: ${score}/${10}</p>
            <button id="homeButton">Go to Home</button>
        `;
        document.getElementById("homeButton").addEventListener("click", ()=>{
            questionContainerHTML.style.display = "none";
            quizContainerHTML.style.display = "grid";
        })
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentQuestionIndex++;
        console.log(currentQuestionIndex)
        if (currentQuestionIndex < 10) {
            answerSelected = false;
            showQuestion();
        }else{
            endQuiz();
        }
    });
};


const updateScore = (score) => {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}