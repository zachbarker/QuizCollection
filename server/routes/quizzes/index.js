var express = require('express');
var router = express.Router();
var db = require('../../database/db');

var currentQuizzes = [];
var questionRouter = require('../questions/index');

router.use('/:quizId/questions', questionRouter);

// Returns the quiz for the given ID
/**
 * @swagger
 * /quizzes/:quizId:
 *  get:
 *      tags: [quizzes]
 *      description: gets quiz with given quizId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.get('/:quizId', (req, res, next) => {
  const userId = req.userId;
  const quizId = req.params.quizId;
  db.query(`SELECT * FROM Quiz WHERE id = ${quizId} AND userId = ${userId} AND deletedAt IS NULL`, (err, result, field) => {
    if(err){
      throw(err);
    } else {
      res.json({quiz: result[0]});
    }
  })
});

// Returns all quizzes when no quizId is specified
/**
 * @swagger
 * /quizzes/:
 *  get:
 *      tags: [quizzes]
 *      description: gets all quizzes for useerId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.get('/', function(req, res, next) {
  const userId = req.userId;
  db.query(`SELECT * FROM Quiz WHERE userId = ${userId} AND deletedAt IS NULL`, (err, result, field) => {
    if(err){
      throw(err);
    } else {
      res.json({quizzes: result});
    }
  })
});

// POST
/**
 * @swagger
 * /quizzes/:
 *  post:
 *      tags: [quizzes]
 *      description: gets quiz with given quizId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
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


// PUT (no id)
/**
 * @swagger
 * /quizzes/:
 *  put:
 *      tags: [quizzes]
 *      description: input quiz with given quizId to db.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.put('/', (req, res, next) => {

  let id = req.body.id;
  let userId = req.userId;
  let title = req.body.title;
  let description = req.body.title;

  
  db.query(`UPDATE Quiz SET title = '${title}', description = '${description}' WHERE id = ${id} AND userId = ${userId} AND deletedAt IS NULL;`, 
           (err, result, fields) => {
              if(err){
                  throw(err);
                } else {
                  res.json({updatedId: id});
                }
  })
});


// PUT (with id)
/**
 * @swagger
 * /quizzes/:id:
 *  put:
 *      tags: [quizzes]
 *      description: update quiz with given quizId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.put('/:id', (req, res, next) => {

  let id = req.params.id;
  let userId = req.userId;
  let title = req.body.title;
  let description = req.body.title;

  
  db.query(`UPDATE Quiz SET title = '${title}', description = '${description}' WHERE id = ${id} AND userId = ${userId} AND deletedAt IS NULL;`, 
           (err, result, fields) => {
              if(err){
                  throw(err);
                } else {
                  res.json({updatedId: id});
                }
  })
});

// DELETE
/**
 * @swagger
 * /quizzes/:id:
 *  deletee:
 *      tags: [quizzes]
 *      description: delete a quiz with given quizId from db.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.delete('/:id', (req, res, next) => {
  let userId = req.userId;
  let quizId = req.params.id;

  db.query(`UPDATE Quiz SET deletedAt = CURRENT_TIMESTAMP WHERE id = ${quizId} AND userId = ${userId}`, 
      (err, result, fields) => {
          if(err){
              throw(err);
            } else {
              res.json({deletedId: quizId});
            }
      });
});

// PATCH
/**
 * @swagger
 * /quizzes/:
 *  patch:
 *      tags: [quizzes]
 *      description: update quiz with given quizId.
 *      responses: 
 *          '200':
 *              description: success!
 */
router.patch('/', (req, res, next) => {
  res.json({data: "this is a PATCH request"});
});

module.exports = router;
