const isAuth = (req,res,next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
}

const isAdmin = (req,res,next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next()
    } else {
        res.send('<h1>You are not admin</h1><p><a href="/login">Login</a></p>');
    }
}

module.exports = {isAuth, isAdmin}

