let numberOfQuestions = document.getElementById("numberOfQuestions")
let categoryMenu = document.getElementById("categoryMenu")
let difficultyLevel = document.getElementById("difficulty")
let questionType = document.getElementById("questionType")
let goButton = document.getElementById("getem")
let sessionToken = ""

goButton.addEventListener("click", () => {
    let amount = ""
    if(numberOfQuestions.value != "") {
        amount = `amount=${numberOfQuestions.value}`
    }
    let category = ""
    if(categoryMenu.value != "") {
        category = `&category=${categoryMenu.value}`
    }
    let difficulty = ""
    if(difficultyLevel.value != "") {
        difficulty = `&difficulty=${difficultyLevel.value}`
    }
    let type = ""
    if(questionType.value != "") {
        type = `&type=${questionType.value}`
    }
    let token = ""
    if(sessionToken != "") {
        token = `&token=${sessionToken}`
    }
    let triviaURL = `https://opentdb.com/api.php?${amount}${category}${difficulty}${type}${token}`
    getTrivia(triviaURL)
})

async function getTrivia(url) {
    let rawResponse = await fetch(url)
    let response = await rawResponse.json()
    // Trivia JSON HERE!!!!
    //use previewquiz(response) to launch previewer here or start(response) to launch a game here...
    //previewquiz(response);
    if(response.response_code == 0) {
        start(response)
    } else if(response.response_code == 4) {
        alert("Too many questions requested, ask for less. Reseting session token.")
        resetToken()
    }
}
 
async function getToken() {
    let tokenURL = "https://opentdb.com/api_token.php?command=request"
    let rawSessionToken = await fetch(tokenURL)
    let sessionTokenJSON = await rawSessionToken.json()
    sessionToken = sessionTokenJSON.token
}

async function resetToken() {
    let resetURL = `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
    await fetch(resetURL)
}

async function getCategories() {
    let catURL = "https://opentdb.com/api_category.php"
    let rawResponse = await fetch(catURL)
    let response = await rawResponse.json()
    displayCats(response)
}

function displayCats(categories) {
    let triviaCategories = []
    triviaCategories.push(`<option value="">Select Category</option>`)
    categories.trivia_categories.forEach((cat) => {
        triviaCategories.push(`<option value="${cat.id}">${cat.name}</option>`)
    })
    categoryMenu.innerHTML = triviaCategories.join(" ")
}

getCategories()
