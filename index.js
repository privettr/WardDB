const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Patient = require('./models/patient');
const methodOverride = require('method-override');
const patientRoutes = require('./routes/patients')
const userRoutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const engine = require('ejs-mate');
const { isLoggedIn } = require('./middleware')

mongoose.connect('mongodb://127.0.0.1:27017/warddb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'));


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.engine('ejs', engine);


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Logged in as ${req.user.firstName} ${req.user.lastName}`)
    res.redirect('/patients')
})

app.get('/logout', isLoggedIn, (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Logged out successfully');
        res.redirect('/login');
    })
})

app.use('/users/', userRoutes);
app.use('/', patientRoutes);

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})

