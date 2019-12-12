// database functions go here
function addQuiz(uid, quiz) {
    // add a quiz to the database
    db = firebase.database();
    db.ref('users/' + uid).push().set(quiz);
}

function deleteQuiz(uid, quizId) {
    // delete a quiz from the database
    db = firebase.database();
    db.ref('users/' + uid).child(quizId).remove();
}

function updateUserQuizzes(snapshot) {
    // TODO update the user's quiz list
    //console.log(snapshot.val());
}
