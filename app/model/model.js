var mongoose = require('mongoose');
var Schema = mongoose.Schema;



// ----------- Quiz ---------------------------
var language = new Schema({
    name: String,
    createdAt: Date,
    updatedAt: Date,
});
mongoose.model('language', language);

var categories = new Schema({
    name: String,
    langId: [],
    createdAt: Date,
    updatedAt: Date,
});
mongoose.model('categories', categories);

var questions = new Schema({
    catId: String,
    langId: String,
    type: String,
    difficulty: String,
    question: String,
    correctAnswer: String,
    answers: [],
    createdAt: Date,
    updatedAt: Date,
});
mongoose.model('questions', questions);


