const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require('cors')
const app = express();
const bcrypt = require('bcrypt');
const layouts = require('express-ejs-layouts');
const flash = require('connect-flash')
const ejs = require('ejs');
const methodOverride = require("method-override");
const User = require('./models/User')
const News = require('./models/news')
const mongoose = require('mongoose');
const isAuth = require('./config/isAuth')
const session = require('express-session')
const path = require('path')
const fs = require("fs")
const request = require('request');
const MongoDBSession = require('connect-mongodb-session')(session)
// -------   CSRF TOKEN   ---------------
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })
const parseForm = bodyParser.urlencoded({ extended: false })
//  --------- Manage time management in frontend
app.locals.moment = require('moment')
// ------------- MongoDB coonecting -------------
const MongoURI = "mongodb://localhost:27017/local"
mongoose
    .connect(MongoURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then((res) => {
        console.log(`MongoDB Connected`);
    })
// ------------- SESSION ------------- 
const session_time = 1000 * 60 * 60 * 24 // sessiya muddati - 1 kun
const store = new MongoDBSession({
    uri: MongoURI,
    collection: "MYSession"
})
app.use(session({
    secret: "session_key_secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: session_time
    }
}))
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));
app.use(layouts)
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors())
app.use(flash())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// EJS Static
app.use(express.static('public'));
app.use('/plugins', express.static(__dirname + 'public/plugins'))
app.use('/uploads', express.static(__dirname + 'public/uploads'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/fonts', express.static(__dirname + 'public/fonts'))
app.use('/icon', express.static(__dirname + 'public/icon'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/pages', express.static(__dirname + 'public/pages'))
app.use('/scss', express.static(__dirname + 'public/scss'))
// Set EJS Views 
app.set('views', './views')
app.set('view engine', 'ejs')
// ---- ROUTES ----
app.use('/new', require('./routes/newsRouter'))
app.use('/moderator', require('./routes/userRouter'))
app.use('/admin', require('./routes/adminRouter'))





// --------------------------- A D M I N - A P I  ---------------------------
// ====================  Log-in && Log-out   ====================
app.get('/login', csrfProtection, async (req, res) => {
    res.render('./loginWeb/login', {title: 'Karvon',layout: './home',csrfToken: req.csrfToken()})
})
app.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect('/login')
})
// ====================  Dashboard  ====================
app.get('/dashboard', isAuth, async (req, res) => {
    const moderator = await User.find({ role: 'moderator' }).countDocuments()
    const yangilik = await News.find().countDocuments()
    const lastFiveNews = await News.find().sort({ date: -1 }).skip(0).limit(5)
    const admin = req.session.user
    if (!res.session && !req.session.user) {res.redirect('/login')}
    res.render('./dashboard/dashboard', {title: 'Dashboard', layout: './layouts',moderator, yangilik, lastFiveNews, admin})
})
// ====================  Moderator  ====================
app.get('/adding/moderator', async (req, res) => {
    const admin = req.session.user
    res.render('./moderator/moderator_add',{ title: 'Moderator', layout: './layouts', admin })}
)
//  ====================  Getting all categories for adding for NEWS PAGE  ====================
app.get('/news', async (req, res, next) => {
    const admin = req.session.user
    res.render('./news/new_add', {title: 'News',layout: './layouts',admin})
})





// --------------------------- A D M I N - A P I  ---------------------------
app.get('/', async (req, res, next) => {
    // 1.so'ngi yangiliklar
    const lastNew = await News.find().sort({ date: -1 }).limit(1)
    // 2.Asossiy yangiliklar
    const mainNew = await News.find().sort({ date: -1 }).limit(3)
    // 3.Jahon yangiliklari
    const worldNew = await News.find({ categoryID: 'jahon' }).sort({ date: -1 }).limit(8)
    // 4.mahalliy yangiliklar
    const localNew = await News.find({ categoryID: 'mahalliy' }).sort({ date: -1 }).limit(12)
    // 5.biznes yangiliklar
    const businessNew = await News.find({ categoryID: 'biznes' }).sort({ date: -1 }).limit(8)
    res.render('./first-page/index', {title: 'Karvon',layout: './home',lastNew, mainNew, worldNew, localNew, businessNew})
})



















const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server is running ${PORT}`)
})
