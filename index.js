// require packages
const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
// const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')


// load config 
dotenv.config({path: './config/config.env'})

// passport config
const passport = require('./config/passport')

connectDB()

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )

// Handlebars Helpers
const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  } = require('./helpers/hbs')


// HBS setup 
app.engine(
    '.hbs',
    exphbs({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
      },
      defaultLayout: 'main',
      extname: '.hbs',
      layoutsDir: "views/layouts/"
    })
)

app.set('view engine','.hbs')




// session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store : new MongoStore({mongooseConnection: mongoose.connection})
  }))

// passport middleware 
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))



if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))


const PORT = process.env.PORT || 5000

app.listen(PORT , console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))