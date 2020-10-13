const express = require('express');
const { sequelize, Book } = require('./models');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const books = require('./routes/books');

const app = express();

// view engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Load Static Files
app.use('/static', express.static('public'));

/*Book Routes*/
app.use('/books', books);
app.get('/', (req, res) => {
  res.redirect('/books') //redirect to homepage
});

/* ERROR HANDLERS*/

// 404 error handler
app.use( (req, res, next) => {
  // render the error page
    const err = new Error('Sorry. That page does not exist.');
    err.status = 404;
    next(err);
});

// global error handler
app.use( (err, req, res, next) => {
    if (err.status === 404){
        res.status(404).render('page-not-found', {err, title: "404 Error"});
    } else {
        err.message = err.message || 'Oops! It looks like something went wrong on the server.';
        res.status(err.status || 500).render('error', {err, title: "Server Error"});
    }
});

app.listen(3000, console.log('Project started on localhost: 3000.'));
module.exports = app;