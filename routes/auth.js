const passport = require('passport')
const router = require('express').Router()


//@desc Auth with google
// route  auth/google
router.get('/google',
    passport.authenticate('google', { scope: ['profile'] }));

// @desc Auth with github
// route auth/github
router.get('/github',
    passport.authenticate('github'))


router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });


router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

// @desc Logout user 
// route /logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router