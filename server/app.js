var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/logoSchemas');
var cors = require("cors");
var proxy = require("html2canvas-proxy");
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');
var cookieSession = require('cookie-session');

mongoose.connect('mongodb://localhost/node-graphql', { promiseLibrary: require('bluebird'), useNewUrlParser: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// passport
app.use(cookieSession({
  name: 'session',
  //maxAge: 25 * 60 * 60 * 1000,
  keys: ['gologologologolo']
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: '65335129431-rfeja5pi7no0fblpn0gvdjsl134usjk2.apps.googleusercontent.com',
  clientSecret: 'Qwj1nQ3AW034QdGw5r5yU_Ra',
  callbackURL: 'http://localhost:3000/api/auth/google.callback'
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use('/', indexRouter);

app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/api/auth/google.callback', 
  passport.authenticate('google', {
    failureRedirect: '/'
  }), 
  (req, res) => {
    req.session.token = req.user.token;
    req.session.id = req.user.id;
    res.redirect('http://localhost:3001/home/'+req.user.id);
});

app.get('/', (req, res) => {
  if(req.session.token)
  {
    res.cookie('token', req.session.token);
    res.json({
      status: 'session cookie set'
    });
    res.redirect('http://localhost:3001/home/'+req.user.id)
  }
  else {
    res.cookie('token', '');
    res.cookie('id', '');
    res.json({
      status: 'sesson cookie not set'
    });
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.session = null;
  res.redirect('http://localhost:3001/');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/proxy', proxy());
var port = (process.env.port || 9987)
app.listen(port);

app.use('/users', usersRouter);
app.use('*', cors());
app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
