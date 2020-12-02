var express = require('express');
var router = express.Router();
var db = require('../../database/db');

var currentQuizzes = [];
var questionRouter = require('../questions/index');

router.use('/:quizId/questions', questionRouter);

// Returns the quiz for the given ID
router.get('/:quizId', (req, res, next) => {
  const userId = req.userId;
  const quizId = req.params.quizId;
  db.query(`SELECT * FROM Quiz WHERE id = ${quizId} AND userId = ${userId}`, (err, result, field) => {
    if(err){
      throw(err);
    } else {
      res.json({quiz: result[0]});
    }
  })
});

// Returns all quizzes when no quizId is specified
router.get('/', function(req, res, next) {
  const userId = req.userId;
  db.query(`SELECT * FROM Quiz WHERE userId = ${userId}`, (err, result, field) => {
    if(err){
      throw(err);
    } else {
      res.json({quizzes: result});
    }
  })
});

// POST
router.post('/', function(req, res, next){
  let title = req.body.title;
  let description = req.body.description;
  const userId = req.userId;
  if (!description) {
    db.query(`INSERT INTO Quiz(title, userId) VALUES("${title}", ${userId})`, (err, result, field) => {
      if(err){
        throw(err);
      } else {
        let insertId = result.insertId;
        res.json({insertId: insertId});
      }
    })
  } else {
    db.query(`INSERT INTO Quiz(title, description, userId) VALUES("${title}", "${description}", ${userId})`, (err, result, field) => {
      if(err){
        throw(err);
      } else {
        let insertId = result.insertId;
        res.json({insertId: insertId});
      }
    })
  }
});

// PUT
router.put('/', (req, res, next) => {
  res.json({data: "this is a PUT request"});
});

// DELETE
router.delete('/', (req, res, next) => {
  res.json({data: "this is a DELETE request"});
});

// PATCH
router.patch('/', (req, res, next) => {
  res.json({data: "this is a PATCH request"});
});

module.exports = router;
