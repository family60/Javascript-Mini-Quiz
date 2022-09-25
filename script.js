//array of objects for questions to fill up the quiz
var questions = [{
    question: "Inside which HTML element do we put the Javascript?",
    options: {
        option1: "<scripting>",
        option2: "<script>",
        option3: "<js>",
        option4: "Javascript"
    },
    answer: "<script>"
    },{
    question: "Which operator is used to assign a value to a variable?",
    options: {
        option1: "=",
        option2: "*",
        option3: "+",
        option4: "-"
    },
    answer: "="
    },{
    question: "How does one call a function named 'myFunction'?",
    options: {
        option1: "call it on your phone",
        option2: "call my function ();",
        option3: "call myFunction();",
        option4: "myFunction();"
    },
    answer: "myFunction();"
    },{
    question: "If CSS adds the styling to a webpage and the HTML is the structure of said webpage, what does Javascript add?",
    options: {
        option1: "Java, the programming language",
        option2: "Java, Coffee",
        option3: "Scripts, written by William Shakespeare himself",
        option4: "Logic, in form of scripts"
    },
    answer: "Logic, in form of scripts"
    }
];

//grabbing any html elements that are necessary 
var highScores = document.querySelector("#high-scores");
var timer = document.querySelector("#timer");
var time = 60;
var h1 = document.querySelector("h1");
var mainContent = document.querySelector("#main-section-content");
var next = document.querySelector("#next-btn");
var result = document.querySelector("#result");

//variables that need to be created for utility purposes
var score = 0;
var questionsAnswered = -1;
var questionIndex = 0;
var currentQuestion = questions[questionIndex];
var options = [];
var leaderboard = [];

//on click event handler for button that calls nextQuestion function
next.addEventListener("click", nextQuestion);
highScores.addEventListener("click", showLeaderboards);

//if the quiz has just begun (indicated by "questionsAnswered === -1"), then call startQuiz Function
//otherwise, check to see if all questions have been answered or not, if so, then evalute most recent question, set timer to 0 and call endQuiz function
//else, actually setup the next question
function nextQuestion(){
    console.log(questionsAnswered);
    console.log(questions.length);
    if(questionsAnswered === -1){
        startQuiz();
    }else if(questionsAnswered === questions.length){
        evaluate(event);
        time = 0;
        endQuiz();
    }else{
        evaluate(event);
        incrementQuestionIndex();
        //console.log(questionIndex);
        //console.log(currentQuestion);
        //console.log(questionsAnswered);
        console.log(score);
        mainContent.textContent = currentQuestion.question;
        //console.log(options);
        options[0].textContent = currentQuestion.options.option1;
        options[1].textContent = currentQuestion.options.option2;
        options[2].textContent = currentQuestion.options.option3;
        options[3].textContent = currentQuestion.options.option4;

        mainContent.appendChild(options[0]);
        mainContent.appendChild(options[1]);
        mainContent.appendChild(options[2]);
        mainContent.appendChild(options[3]);
    }
};

//function that initilizes the buttons that are used as options and also clean up previous ui so new ones can be rendered inplace of them
function startQuiz(){
    highScores.removeEventListener("click", showLeaderboards);
    //console.log(questions.length);
    countdown();
    h1.setAttribute("style", "display: none");
    mainContent.textContent = currentQuestion.question;
    next.innerHTML = "Next";
    next.setAttribute("style", "display: none");

    var option1 = document.createElement("button");
    option1.setAttribute("id", "option1");
    var option2 = document.createElement("button");
    option2.setAttribute("id", "option2");
    var option3 = document.createElement("button");
    option3.setAttribute("id", "option3");
    var option4 = document.createElement("button");
    option4.setAttribute("id", "option4");

    mainContent.appendChild(option1);
    mainContent.appendChild(option2);
    mainContent.appendChild(option3);
    mainContent.appendChild(option4);

    option1.textContent = currentQuestion.options.option1;
    option2.textContent = currentQuestion.options.option2;
    option3.textContent = currentQuestion.options.option3;
    option4.textContent = currentQuestion.options.option4;

    option1.addEventListener("click", nextQuestion);
    option2.addEventListener("click", nextQuestion);
    option3.addEventListener("click", nextQuestion);
    option4.addEventListener("click", nextQuestion);

    options.push(option1);
    options.push(option2);
    options.push(option3);
    options.push(option4);

    questionsAnswered = 1;
    //nextQuestion();
};

//evaluates if the previous question was answered correctly or not.
//if it was correct, the user's quiz score is incremented and result shows correct
//if it was incorrect, time is deducted from the user's countdown timer and result shows wrong
function evaluate(event){
    var userAnswer = event.target.textContent;
    var answer = currentQuestion.answer;
    //console.log(userAnswer);
    //console.log(answer);
    if(userAnswer == answer){
        result.innerHTML = "Correct!";
        score++;
    }else if(userAnswer != answer){
        result.innerHTML = "Wrong!";
        time = time - 10;
    }
    questionsAnswered++;
};

//responsible for timer/countdown as well as checking to see if it needs to call the endQuiz function by seeing if the time is <= 0
function countdown(){
    var countDown = setInterval( function(){
        time--;
        timer.textContent = "Timer: " + time + "s";
        if(time <= 0){
            clearInterval(countDown);
            time = 0;
            endQuiz();
        }
    }, 1000);
};

//funtion that cleans up ui and appends new ui so that users can see their score and also upload thier name and score to the leaderboard
function endQuiz(){
    options[0].remove();
    options[1].remove();
    options[2].remove();
    options[3].remove();

    mainContent.innerHTML = "All Done! Your final score is " + score + "/4";

    var nameField = document.createElement("input");
    nameField.setAttribute("input", "text");
    nameField.setAttribute("id", "name-field");
    mainContent.appendChild(nameField);

    var submitScore = document.createElement("button");
    submitScore.setAttribute("id", "submit-score-btn");
    mainContent.appendChild(submitScore);
    submitScore.innerHTML = "Submit Score";

    submitScore.addEventListener("click", addToLeaderboard);
}

//increments current question index and sets the currentQuestion to it
function incrementQuestionIndex(){
    questionIndex++;
    currentQuestion = questions[questionIndex];
}

//meant to be called at the end of the quiz as it adds the user's score and name to the local leaderboard after checking to see if it  exists first
function addToLeaderboard(){
    if(localStorage.getItem("leaderboard") !== null){
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }else{
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }
    var name = document.getElementById("name-field").value;
    console.log(score, name);
    leaderboard.push(score, name);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showLeaderboards();
    var playAgain = document.createElement("button");
    playAgain.innerHTML = "Play Again?";
    playAgain.setAttribute("id", "play-again-btn");
    result.appendChild(playAgain);
    playAgain.addEventListener("click", reset);
}

//displays the leaderboards by reading it from local storage and then sorting it
function showLeaderboards(){
    mainContent.textContent = "";
    leaderboard.sort();
    leaderboard.reverse();
    for(var c = 0; c < leaderboard.length; c++){
        mainContent.textContent += leaderboard[c] + "\n";
    }
    var clearLeaderboardBtn = document.createElement("button");
    clearLeaderboardBtn.setAttribute("id", "clear-leaderboard-btn");
    clearLeaderboardBtn.innerHTML = "Clear Leaderboard";
    mainContent.appendChild(clearLeaderboardBtn);
    clearLeaderboardBtn.addEventListener("click", clearLeaderboard);
}

//clears local storage and therefore the leaderboards
function clearLeaderboard(){
    localStorage.clear();
    mainContent.textContent = "";
    leaderboard = [];
}

//provides a full reset to all things concerning the ability for users to play the same quiz again.
function reset(){
    console.log("restarting");
    score = 0;
    questionsAnswered = -1;
    questionIndex = 0;
    currentQuestion = questions[questionIndex];
    options = [];
    h1.setAttribute("style", "display: true");
    document.getElementById("play-again-btn").remove();
    document.getElementById("clear-leaderboard-btn").remove();
    mainContent.textContent = "Test your knowledge and understanding of Javascript with this short quiz on some of the basics!";
    result.innerHTML = "";
    next.setAttribute("style", "display: true");
    time = 60;
    highScores.addEventListener("click", showLeaderboards);
}