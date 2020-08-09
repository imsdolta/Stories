const passport = require('passport')

const router = require('express').Router()

//Auth with google
//  auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

  
//Auth with github
//  auth/github
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
  
  // Logout user 
  router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/')
  })
module.exports = router
