class Quiz {
    constructor(quizName, quizOwner) {
        this.name = quizName;
        this.owner = quizOwner;
        this.questions = [];
    }
}

class Question {
    constructor(questionText) {
        this.text = questionText;
        this.correctanswer = 0;
        this.answers = [];
    }
}

class User {
    constructor(uid, email) {
        this.uid = uid;
        this.email = email;
    }
}
