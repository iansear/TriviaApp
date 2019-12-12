function displayQuestion(quiz,n) {
    // function to display the nth question from a quiz

    // a Quiz is an object with:
    // name(string)
    // owner(string)
    // quizQuestions[] (Question)

    // a Question is an object with
    // text(string)
    // answers[] (string)

    const questionnum = document.getElementById('questionnum');
    const question = document.getElementById('question');
    const answers = document.getElementById('answers');
    const users = document.getElementById('users');
    const countdown = document.getElementById('countdown');

    qindex = n;
    if (playerObj != null) {
        leaderPlayerObj = playerObj;
    }

    // get the nth question from this quiz
    q = quiz.questions[n];
    questionnum.innerHTML = `Question: ${n+1}`;
    question.innerHTML = q.text;

    let dispAnswers = [];
    for (let i = 0; i < q.answers.length; i++) {
        dispAnswers.push(q.answers[i]);
    }
    shuffle(dispAnswers);
    // figure out where the right answer got shuffled to
    for (let i = 0; i < dispAnswers.length; i++) {
        if (dispAnswers[i] == q.answers[q.correctanswer]) {
            dispCorrect = i;
        }
    }

    // create the answer buttons
    let answersHTML = [];
    for (let i = 0; i < dispAnswers.length; i++) {
        answersHTML.push(`<div class="col"><button id="${i}" onclick="buttonClick(event);">${dispAnswers[i]}</button></div>`);
    }
    answers.innerHTML = answersHTML.join(' ');
}

function shuffle(array) {
    // use the Fisher-Yates shuffle algorithm to randomize the answers order
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    
        // swap elements array[i] and array[j] - this is the same as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
      }
}
