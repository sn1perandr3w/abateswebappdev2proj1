//Author: Andrew Bates
//Student No: 20075908
//Based on code written by David Drohan (ddrohan.github.io)

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const tournaments = require("./routes/tournaments");
const accounts = require("./routes/accounts");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

//Routes for Tournaments

app.post('/tournaments',tournaments.addTournament);
app.delete('/tournaments/:id', tournaments.deleteTournament);
app.put('/tournaments/:id/interest', tournaments.incrementInterest);

app.post('/tournaments/:id/participants',tournaments.addParticipant);

app.delete('/tournaments/:id/participants/:pid', tournaments.removeParticipant);

app.get('/tournaments', tournaments.findAll);


//Routes for Accounts

app.post('/accounts',accounts.addAccount);
app.get('/accounts/:username', accounts.findOne);
app.delete('/accounts/:id', accounts.deleteAccount);
app.put('/accounts/:id/endorsement', accounts.incrementEndorsement);
app.put('/accounts/:id/balance/:addition', accounts.incrementBalance);


//New Routes for assignment 2
app.get('/tournaments/:id/participants',tournaments.findParticipants);
app.put('/accounts/:id/rmbalance/:subtraction', accounts.decrementBalance);
app.put('/tournaments/:id/uninterest', tournaments.decrementInterest);
app.get('/accounts', accounts.findAll);

//Unused in Front End App which are legacy calls to functions from first iteration
app.get('/tournaments/:id', tournaments.findOne);
app.get('/tournaments/:id/interest', tournaments.findInterest);






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
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));


module.exports = app;
