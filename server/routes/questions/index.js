var express = require('express');
var router = express.Router({mergeParams: true});
var db = require('../../database/db');

// GET
/**
 * @swagger
 * /questions/:
 *  get:
 *      tags: [questions]
 *      description: get question with given userId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
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
/**
 * @swagger
 * /questions/:
 *  post:
 *      tags: [questions]
 *      description: update question with extracted questionId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
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
/**
 * @swagger
 * /questions/:questionId:
 *  put:
 *      tags: [questions]
 *      description: update question with given questionId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
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
/**
 * @swagger
 * /questions/:
 *  put:
 *      tags: [questions]
 *      description: update question with extracted questionId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
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
/**
 * @swagger
 * /questions/:id:
 *  delete:
 *      tags: [questions]
 *      description: deleete question with given questionId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.delete('/:id', (req, res, next) => {
    let userId = req.userId;
    let questionId = req.params.id;

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