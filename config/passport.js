// Google and github Authentication
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport')

const mongoose = require('mongoose')
const UserModel = require('../models/User');
const User = require('../models/User');



 
passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) =>{
        const newUser = {
            githubId:'none',
            googleId : profile.id,
            displayName : profile.displayName,
            firstName : profile.name.givenName,
            lastName : profile.name.familyName,
            image : profile.photos[0].value
        }
        try{
            let user = await User.findOne({googleId:profile.id})
            if(user) done(null, user)
            else {
                user = await User.create(newUser)
                done(null,user)
            }
        } catch {
            console.err(err)
        }
    }
    ));

passport.use(new GitHubStrategy({
        clientID : process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET,
        callbackURL:'https://node-story-app.herokuapp.com/auth/github/callback'
    },

    async (accessToken,refreshToken,profile,done)=>{
        const newUser = {
            googleId:'none',
            githubId : profile.id,
            displayName : profile.username,
            firstName : profile.displayName,
            lastName : ' ',
            image : profile.photos[0].value
        }
        try{
            let user = await User.findOne({githubId:profile.id})
            if(user) done(null, user)
            else {
                user = await User.create(newUser)
                done(null,user)
            }
        } catch(err) {
            console.error(err)
        }
    }))

    
    
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user) => done(err,user))
    })


module.exports = passport

