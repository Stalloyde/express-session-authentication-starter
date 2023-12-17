const { serializeUser } = require('passport');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database');
const User = connection.models.User;
const validPassword = require('../lib/passwordUtils').validPassword

 
const verifyCallback = async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false);
            };
            const isValid = validPassword(password, user.hash, user.salt);
            if (!isValid) {
                // passwords do not match!
                return done(null, false)
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        };
};

const strategy = new LocalStrategy(verifyCallback)
passport.use(strategy)

passport.serializeUser((user,done) => {
    done(null, user.id)
})

passport.deserializeUser(async(userId,done) => {
    try {
        const user = await User.findById(userId)
        done(null,user)
    } catch (err){
        return done(err)
    }
})