var express = require('express');
var router = express.Router();
var db = require('../../database/db');

var currentQuizzes = [];

// Returns the quiz for the given ID
router.get('/:quizId', function(req, res, next) {
  const userId = req.userId;
  const quizId = req.params.quizId;
  db.query(`SELECT * FROM Quiz WHERE id = ${quizId} AND userId = ${userId}`, function (err, result, field) {
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
  db.query(`SELECT * FROM Quiz WHERE userId = ${userId}`, function (err, result, field) {
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
    db.query(`INSERT INTO Quiz(title, userId) VALUES("${title}", ${userId})`, function (err, result, field) {
      if(err){
        throw(err);
      } else {
        let insertId = result.insertId;
        res.json({insertId: insertId});
      }
    })
  } else {
    db.query(`INSERT INTO Quiz(title, description, userId) VALUES("${title}", "${description}", ${userId})`, function (err, result, field) {
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
router.put('/', function(req, res, next){
  res.json({data: "this is a PUT request"});
});

// DELETE
router.delete('/', function(req, res, next){
  res.json({data: "this is a DELETE request"});
});

// PATCH
router.patch('/', function(req, res, next){
  res.json({data: "this is a PATCH request"});
});

module.exports = router;
