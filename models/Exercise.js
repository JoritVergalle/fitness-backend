var mongoose = require('mongoose');

var ExerciseSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    type: {type: String, required: true},
    watt: Number,
    KMU: Number,
    minutes: Number,
    kg: Number,
    amount: Number
});

mongoose.model('exercise', ExerciseSchema);