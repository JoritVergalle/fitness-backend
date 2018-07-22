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

router.post('/users/', function (req, res, next) {
    var user = new User({
        name: req.body.name,
        password: req.body.password,
    });
    user.save(function(err, user) {
        if (err){ return next(err); }
        res.json(user);
    });
});

router.param('user', function(req, res, next, id) {
    var query = User.findById(id);
    query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) {
            return next(new Error('not found ' + id));
        }
        req.user = user;
        return next();
    });
});

router.get('/users/:user', function(req, res) {
    req.user.populate('trainingsSchema', function(err, user) {
        if (err) { return next(err); }
        res.json(user);
    });
});

router.post('/users/:user/exercises', function (req, res, next) {
    var exercise = new Exercise(req.body);
    req.user.trainingsSchema.push(exercise);
    req.user.save(function (err, user) {
        if (err) return next(err);
        res.json(user);
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

// router.delete('/users/:user/exercises/:exercise', function(req, res) {
//     req.exercises.remove(function(err) {
//         if (err) { return next(err); }
//         res.json("exercise is deleted");
//     });
// });
router.delete('/users/:user/exercises/:exercise', function(req, res) {
    req.user.trainingsSchema.pull({_id : req.exercise._id});
    req.user.save(function(err, user) {
        if (err){ return next(err); }
        res.json("Exercise has  been deleted from this user's schema");
    });
});

router.put('/users/:user/exercises/:exercise', function(req, res) {
    if(req.body.type === 'Cardio') {
        Exercise.findOneAndUpdate({_id: req.body._id}, {
            $set: {
                watt: req.body.watt,
                minutes: req.body.minutes,
            }
        }, function(err, result) {
            if (err) {return res.send(err)}
            res.json("Exercise is aangepast");
        });
    }
    else {
        Exercise.findOneAndUpdate({_id: req.body._id}, {
            $set: {
                amount: req.body.amount,
                kg: req.body.kg,
            }
        }, function(err, result) {
            if (err) {return res.send(err)}
            res.json("Exercise is aangepast");
        });
    }
});

module.exports = router;
