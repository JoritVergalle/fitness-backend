var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var User = mongoose.model('user');
var Exercise = mongoose.model('exercise');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     var query = Traject.find().populate({path: 'locaties', populate: { path: 'afbeeldingen' }}).populate('afspraken').populate('ontwikkelingsdoelen');
//
//     query.exec((function(err, trajecten) {
//         if (err) { return next(err); }
//         res.json(trajecten);
//     }));
// });

router.get('/exercises/', function(req, res, next) {
    Exercise.find(function(err, exercises) {
        if (err) { return next(err); }
        res.json(exercises);
    });
});


router.post('/exercises/', function (req, res, next) {
    var exercise = new Exercise({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        type: req.body.type,
        watt: req.body.watt,
        minutes: req.body.minutes,
        kg: req.body.kg,
        amount: req.body.amount
    });
    exercise.save(function(err, exercise) {
        if (err){ return next(err); }
        res.json(exercise);
    });
});

router.param('exercise', function(req, res, next, id) {
    var query = Exercise.findById(id);
    query.exec(function (err, exercise){
        if (err) { return next(err); }
        if (!exercise) {
            return next(new Error('not found ' + id));
        }
        req.exercise = exercise;
        return next();
    });
});

router.get('/exercises/:exercise', function(req, res) {
    res.json(req.exercise);
});

module.exports = router;


