var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var User = mongoose.model('user');
var Exercise = mongoose.model('exercise');

var auth = jwt({secret: process.env.NOT_A_SECRET, userProperty: 'payload'});

/* GET users listing. */
// router.get('/', function(req, res, next) {
//     var query = Traject.find().populate({path: 'locaties', populate: { path: 'afbeeldingen' }}).populate('afspraken').populate('ontwikkelingsdoelen');
//
//     query.exec((function(err, trajecten) {
//         if (err) { return next(err); }
//         res.json(trajecten);
//     }));
// });

// router.post('/users/', function (req, res, next) {
//     var user = new User({
//         username: req.body.username,
//         password: req.body.password,
//     });
//     user.save(function(err, user) {
//         if (err){ return next(err); }
//         res.json(user);
//     });
// });

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


router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password)
    user.save(function (err){
        if(err){ return next(err); }
        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }
        if(user){
            return res.json({
                "_id": user._id,
                "username": user.username,
                "trainingsSchema": user.trainingsSchema,
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

// router.get('/users/:user', function(req, res) {
//     req.user.populate('trainingsSchema', function(err, user) {
//         if (err) { return next(err); }
//         res.json(user);
//     });
// });

// router.post('/login', function(req, res, next){
//     if(!req.body.username || !req.body.password){
//         return res.status(400).json({message: 'Please fill out all fields'});
//     }
//     passport.authenticate('local', function(err, user, info){
//         if(err){ return next(err); }
//         if(user){
//             return res.json({token: user.generateJWT()});
//         } else {
//             return res.status(401).json(info);
//         }
//     })(req, res, next);
// });

router.post('/checkusername', function(req, res, next) {
    // if (req.body.username) {
    User.find({username: req.body.username}, function(err, result) {
        if (result.length) {
            res.json({'username': 'alreadyexists'})
        } else {
            res.json({'username': 'ok'})
        }
    });
    // }
});

module.exports = router;
