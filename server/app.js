var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

let swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: "nodeSwaggerApi",
    version: "1.0.0",
    description: "node swagger api"
  },
  tags: [
    { name: "auth" },
    { name: "questions"},
    { name: "quizzes"}
  ],
  servers: [ {url: "ec2-52-15-165-251.us-east-2.compute.amazonaws.com/api/v1"} ],
  basePath: "/",

}

let options = {
  swaggerDefinition: swaggerDefinition,
  apis: ["./routes/auth/index.js", "./routes/questions/index.js", "./routes/quizzes/index.js"],
}

let swaggerSpec = swaggerjsdoc(options);

var indexRouter = require('./routes/index');
const { json } = require('express');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.options("*", cors());
app.use(cors());

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerSpec, {explore: true}));

app.use('/api/v1', indexRouter);


// catch 404 and forward to error handler
app.use((req, res, next)  => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;