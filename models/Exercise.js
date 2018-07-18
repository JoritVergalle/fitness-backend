var mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    type: {type: String, required: true},
    watt: Number,
    minutes: Number,
    kg: Number,
    amount: String
});

mongoose.model('exercise', ExerciseSchema);