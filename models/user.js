const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

//Define our model
const userSchema = new Schema({
	socialId: { type: String, index: {
      unique: true,
      partialFilterExpression: {socialId: {$type: 'string'}}
    }},
	provider: String,
	username: String,
	email: { type: String, unique: true, lowercase: true, dropDups: true },
	password: String,
	image: String,
	about: String,
	country_from: String,
	country_in: {
		country: String,
		city: String
	},
	subscriptions: Array,
	posts: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post"
    }],
    comments: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
    }],
    notifications: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Notification"
    }]
});


userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) { console.log(err);return callback(err) }
		callback(null, isMatch);
	});
}

//create the model class
const ModelClass = mongoose.model('User', userSchema);

//export the model
module.exports = ModelClass;