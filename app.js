var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http=require('http');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var userRouter = require('./routes/router/user');
var camionRouter = require('./routes/router/camion');
var generalRouter = require('./routes/router/general');

var app = express();

// view engine setup
/*app.use(express.static(__dirname + 'views'));
app.set('view engine', 'jade');*/

app.use(express.static(__dirname + 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/camion', camionRouter);
app.use('/general', generalRouter);

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

//creando server para socket y app
var server=http.createServer(app);
var io = require('socket.io').listen(server);

var cb1=require('./routes/router/io');

io.on('connection',cb1);

//port

server.listen(8000,()=>{
  console.log('server corriendo en el puerto 8000');
});

module.exports = app;
