const router = require('express').Router();
const passport = require('passport');
const {isAuth, isAdmin} = require('./Authenticate')
const genPassword= require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;

/**
 * -------------- POST ROUTES ----------------
 */

 // TODO
 router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/login-success'}));

 // TODO
 router.post('/register', async (req, res, next) => {
    const password = genPassword(req.body.password)
    const user = new User({username:req.body.username, hash: password.hash, salt: password.salt, admin: true} )
    await user.save()
    res.redirect('/login')
 });


 /**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/login', (req, res, next) => {
   
    const form = '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);

});

// When you visit http://localhost:3000/register, you will see "Register Page"
router.get('/register', (req, res, next) => {

    const form = '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

    res.send(form);
    
});


/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('<h1>You are an Admin</h1><p><a href="/logout">Logout and reload</a></p>');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/protected-route');
});

router.get('/login-success', isAuth, (req, res, next) => {
    if (req.user.admin) {
        res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a> <a href="/admin-route">Go to admin route</a></p>');
    } else {
        res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
    }
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;