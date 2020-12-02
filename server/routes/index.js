var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var usersRouter = require('./users');
var quizRouter = require('./quizzes/index');
var authRouter = require('./auth/index');
var questionRouter = require('./questions/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/users', usersRouter);
router.use('/quizzes', authTokenValidation, quizRouter);
router.use('/auth', authRouter);
router.use('/questions', authTokenValidation, questionRouter);

module.exports = router;

// authentication
function authTokenValidation(req, res, next) {
  let authToken = req.headers["x-auth-token"];
  jwt.verify(authToken, "randomstring", {
    algorithms: ['HS256']
  }, function (err, decoded) {
    if(err) {
      res.status(401).json({error: "invalid auth token"});
    } else {
      req.userId = decoded.userId;
      console.log(decoded.userId);
      next();
    }
  });
}
