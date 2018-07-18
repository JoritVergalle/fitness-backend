var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String, lowercase: true, unique: true },
    password: String,
    trainingsSchema: [{type: mongoose.Schema.Types.ObjectId, ref: 'exercise'}],
});

mongoose.model('user', UserSchema);