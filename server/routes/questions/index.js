var express = require('express');
var router = express.Router({mergeParams: true});
var db = require('../../database/db');

// GET
router.get('/', (req, res, next) => {

    let userId = req.userId;
    let quizId = req.params.quizId;

    if(quizId) {
      db.query(`SELECT * FROM Question WHERE userId = ${userId} AND quizId = ${quizId} AND deletedAt IS NULL`, (err, result, field) => {
        if(err){
            throw(err);
        } else {
            res.json({questions: result});
        }
    });
    } else {
      db.query(`SELECT * FROM Question WHERE userId = ${userId} AND deletedAt IS NULL`, (err, result, field) => {
        if(err){
            throw(err);
        } else {
            res.json({questions: result});
        }
      });
    }

});

// POST
router.post('/', (req, res, next) => {
  let question = req.body.question;
  let answer = req.body.answer;
  let incorrectOne = req.body.incorrectOne;
  let incorrectTwo = req.body.incorrectTwo;
  let quizId = req.body.quizId;
  let userId = req.userId;

  db.query(`INSERT INTO Question(question, answer, incorrectOne, incorrectTwo, quizId, userId) 
            VALUES("${question}", "${answer}", "${incorrectOne}", "${incorrectTwo}", "${quizId}", "${userId}")`, 
            (err, result, field) => {

    if(err){
      throw(err);
    } else {
      
      let insertId = result.insertId;
      res.json({insertId: insertId});
    }
  })
});

// PUT (UPDATE)
router.put('/:questionId', (req, res, next) => {
    let questionId = req.params.questionId;
    let userId = req.userId;
    let answer = req.body.answer;
    let incorrectOne = req.body.incorrectOne;
    let incorrectTwo = req.body.incorrectTwo;
    
    db.query(`UPDATE Question SET answer = '${answer}', incorrectOne = '${incorrectOne}', incorrectTwo = '${incorrectTwo}' WHERE id = ${questionId} AND userId = ${userId} AND deletedAt IS NULL;`, 
             (err, result, fields) => {
                if(err){
                    throw(err);
                  } else {
                    res.json({updatedId: questionId});
                  }
    })
});

// PUT (INSERT)
router.put('/', (req, res, next) => {
    let questionId = req.body.questionId;
    let userId = req.userId;
    let answer = req.body.answer;
    let incorrectOne = req.body.incorrectOne;
    let incorrectTwo = req.body.incorrectTwo;
    
    db.query(`UPDATE Question SET answer = '${answer}', incorrectOne = '${incorrectOne}', incorrectTwo = '${incorrectTwo}' WHERE id = ${questionId} AND userId = ${userId} AND deletedAt = NULL;`, 
             (err, result, fields) => {
                if(err){
                    throw(err);
                  } else {
                    res.json({updatedId: questionId});
                  }
    })
});

// DELETE
router.delete('/', (req, res, next) => {
    let userId = req.userId;
    let questionId = req.body.questionId;

    db.query(`UPDATE Question SET deletedAt = CURRENT_TIMESTAMP WHERE id = ${questionId} AND userId = ${userId}`, 
        (err, result, fields) => {
            if(err){
                throw(err);
              } else {
                res.json({deletedId: questionId});
              }
        });
});

module.exports = router;