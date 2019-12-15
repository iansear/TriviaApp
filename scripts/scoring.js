let scoreboard = document.getElementById("scoreboard")

//Displays score(s) to scoreboard/leaderboard
function displayScores(scores) {
    let scoreboardItems = []
    scoreboardItems.push("<ul>")
    for(let i = 0; i < scores.length; i ++) {
        scoreboardItems.push(`<li>${scores[i].name} Score: ${scores[i].score}</li>`)
    }
    scoreboardItems.push("</ul>")
    scoreboard.innerHTML = scoreboardItems.join(" ")
}

//Gets quiz results from the firebase and tallys score of player(s)
function getScores(pin) {
    let players = firebase.database().ref().child("games").child(pin).child("players")
    let scores = []

    players.on("value",(snapshot) => {
        let players = snapshot.val()
        let userIDs = Object.keys(players)
        for(let i = 0; i < userIDs.length; i++) {
            let name = ""
            let score = 0
            let id = userIDs[i]
            let playerGame = players[id]
            let playerGameKeys = Object.keys(playerGame)
            for(let j = 0; j < playerGameKeys.length; j++) {
                let element = playerGame[playerGameKeys[j]]
                if(typeof element[0] == "number") {
                    score += element[0]
                } 
                else {
                    name = element
                }
            }
            scores.push({
                name: name,
                score: score
            })
        }
        displayScores(scores)
    })
}
