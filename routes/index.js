const router = require('express').Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/Story')

router.get('/', ensureGuest, (req, res)=> {
    res.render('login', {
        layout:'login'
    })
})

router.get('/dashboard',ensureAuth, async (req,res)=>{
    try {
        const stories = await Story.find({user : req.user.id}).lean()
            res.render('dashboard', {
                layout:'main',
                name : req.user.firstName,
                stories
            })
        } catch (err) {
            console.error(err);
            res.render('error/500')
        }

    
})

module.exports = router