let qindex = 0;
let dispCorrect = -1;
let playerObj = null;
let gameRef = null;
let playerRef = null;
let joinedUsers = 0;
let responseCount = 0;

function start(response, mode = 'S') {
    // response is quiz data from the trivia API

    // mode is a character indicating play mode:
    // 'M' = multiplayer
    // 'S' = single (leader) player
    // 'B' = multiplayer + admin is playing

    // ensure we are starting with a clean slate for a new game
    qindex = 0;
    dispCorrect = -1;
    playerObj = null;
    gameRef = null;
    playerRef = null;
    joinedUsers = 0;
    responseCount = 0;

    // this bit needs to move into user's list handler section
    let myquiz = readquiz('Trivia API',appUser.email,response);
    addQuiz(appUser.uid, myquiz);

    // create pin for this game instance
    // TODO - make sure this pin hasn't been used here...
    let pin = '';
    for (let i=0; i < 7; i++) {
        pin = `${pin}${getRandomInt().toString()}`;
    }
    gameRef = firebase.database().ref('games/'+pin);
    // set game status to JOINING
    gameRef.child('question').set({text: 'JOINING', num: -1});

    // show the play section
    // TODO tell players where to go to join the game
    // add header info to users element
    headerHTML = `<div class="col">Quiz title: ${myquiz.name}</div>
                <div class="col">Quiz owner: ${myquiz.owner}</div>`;
    users.innerHTML = headerHTML;
    // setup the main play section
    questionnum.innerHTML = '---';
    question.innerHTML = `Waiting for players to join with game id ${pin}`;
    answers.style.display = 'none';
    // collapse landing and show display
    login.style.display = 'none';
    landing.style.display = 'none';
    play.style.display = 'block';

    if (mode != 'S') {
        // multi - player mode
        gameRef.child('players').on('child_added', (snapshot) => {updateUserList(snapshot)});
        if (mode == 'B') {
            // this is Both mode - host is playing and remote players may join
            playerObj = {'name': appUser.email};
            for (let i = 0; i < myquiz.questions.length; i++) {
                let key = i.toString();
                playerObj[key] = [0, -1];
            }
            playerRef = gameRef.child('players').push(playerObj);
        }
        let countdownJoinDisp = 30;
        let id = setInterval(cdown_join, 1000);
        function cdown_join() {
            questionnum.innerHTML = countdownJoinDisp;
            countdownJoinDisp -= 1;
            if (countdownJoinDisp == 0) {
                clearInterval(id);
                questionnum.innerHTML = '---';
                if (joinedUsers > 0) {
                    // there is at least one player, so run the game loop
                    qLoop(pin, myquiz, playerObj)
                }
                else {
                    // nobody wanted to play with us so jump back to the landing page
                    login.style.display = 'none';
                    landing.style.display = 'block';
                    play.style.display = 'none';
                }
            }
        }
    }
    else {
        // single - player mode
        console.log(pin);  // temporary - in single player log pin to console so i can watch DB
        playerObj = {'name': appUser.email};
        for (let i = 0; i < myquiz.questions.length; i++) {
            let key = i.toString();
            playerObj[key] = [0, -1];
        }
        gameRef = firebase.database().ref('games/'+pin);
        playerRef = gameRef.child('players').push(playerObj);
        users.innerHTML = `${users.innerHTML}<div>${appUser.email}</div>`;
        joinedUsers += 1;
        qLoop(pin, myquiz, playerObj);
    }
}

async function qLoop(pin, myquiz) {
    // this is the main game loop!
    // show a question, start countdown a timer
    // if all users have responded jump to next question
    
    // show the answer buttons
    answers.style.display = 'flex';

    // iterate over the questions in this quiz
    for (qindex = 0; qindex < myquiz.questions.length; qindex++) {
        responseCount = 0;
        // display the question
        firebase.database().ref('games/'+pin).child('question').set({text: myquiz.questions[qindex].text, qindex: qindex});
        displayQuestion(myquiz, qindex);
        await qTimer(15);
        await flashcorrect();
    }
    // no more questions
    firebase.database().ref('games/'+pin).child('question').set({text: 'GAME_OVER', qindex: -1});    
    getScores(pin);
    questionnum.innerHTML = '---';
    question.innerHTML = `GAME_OVER`;
    answers.style.display = 'none';
    setTimeout(() => { login.style.display = 'none';
                       landing.style.display = 'block';
                       play.style.display = 'none';
                       },3000);
}

async function qTimer(delaySecs) {
    // countdown timer
    let countdownTimeDisp = delaySecs;
    while (countdownTimeDisp>0) {
        countdown.innerHTML = countdownTimeDisp;
        await sleep(1000);
        countdownTimeDisp -= 1;
        // check for responses
        // TODO - fix for multiplayer
        if (responseCount == joinedUsers) {
            // if everybody has responded fast forward to end...
            countdownTimeDisp = 0;
            countdown.innerHTML = '---';
        }
    }
}

function updateUserList(snapshot) {
    users.innerHTML = `${users.innerHTML}<div>${snapshot.val().name}</div>`;
    joinedUsers += 1;
}

function getRandomInt() {
    // get a random integer 0 - 9
    return Math.floor(Math.random() * 10)
}

function buttonClick(ev) {
    // an answer button has been clicked!

    // create a response object
    let response = {'p': playerRef.key, 'q': qindex, 'r': ev.target.id};

    // record this response in the responses list
    gameRef.child('responses').push(response);
    
    // TODO - edit this out later
        // hacks to make single player work!
    let key = qindex.toString();
    if (ev.target.id == dispCorrect) {
        playerObj[key] = [1, -1];
    }
    else {
        playerObj[key] = [0, -1];
    }
    playerRef.set(playerObj);
    responseCount += 1;
    // end of horrible hacks to keep things going

    // response entered - disable the buttons
    ev.target.style.backgroundColor = 'red';

    let buttons = answers.children;
    for (let i=0; i<buttons.length; i++) {
        buttons[i].firstChild.disabled = 'true';
    }
}

async function flashcorrect() {
    // get a handle to the correct answer button
    let correctAnswerButton = -1;
    let buttons = answers.children;
    
    // flash it green 3x
    for (let i=0; i<3; i++) {
        buttons[dispCorrect].firstChild.style.backgroundColor= 'lightgreen';
        await sleep(500);
        buttons[dispCorrect].firstChild.style.backgroundColor= 'blueviolet';
        await sleep(500);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
