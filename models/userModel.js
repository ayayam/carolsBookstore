const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const {Schema} = mongoose;

const mongooseFindOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GoogleStrategy = require('passport-google-oath20').Strategy;

const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: { // update the userSchema to collect Google ID
    type: String,
  }
});
// plugin --> connects the schema to monogoose before going in collection, have to add her so it can initialize
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(mongooseFindOrCreate);

// const User = mongoose.model('User', userSchema);

async function run() {
  await mongoose.connect(`${process.env.DB_URL}`)

  mongoose.model('User', userSchema);

  await mongoose.model('User').findOne();
}

run();

// summon createStrategy: creates a configured 
passport.use(User.createStrategy());

// attachment of special ID and track them, every mvmt afer that
// FOR LOCAL VERSION: login --> crumble cookies --> revel the info --> NOT GOOD
// serialize and deserialize the user
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//NEW CODE
passport.serializeUser(function(user, cb) { //cb = callback
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL:"https://lime-hilarious-oyster.cyclic.app/auth/google/admin" // if testing locally
},
function(accessToken, refreshToken, email, cb) {
  User.findOrCreate({ googleID: email.id }, function (err, user) {
    return cb(err, user);
  });
}));

module.exports = User;