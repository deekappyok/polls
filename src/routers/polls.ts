import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @api {get} /polls/:id Get a poll
 * @apiName GetPoll
 * @apiGroup Polls
 * @apiParam {String} id Poll id
 * @apiSuccess {String} id Poll id
 * @apiSuccess {String} name Poll name
 * @apiSuccess {Array} options Poll options
 * @apiSuccess {Array} voted Poll voted
 * @apiSuccess {Date} createDate Poll create date
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 * {
 *  
 * "id": "5b9d8f9f8f9f9f9f9f9f9f9",
 * "name": "What is your favorite color?",
 * "options": [
 *  {name: "Red", votes: 0},
 * ],
 * "voted": [],
 * "createDate": "2018-01-01T00:00:00.000Z"
 * }
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 404 Not Found
 * {
 * "error": "Poll not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 * "error": "Something went wrong"
 * }
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const Poll = mongoose.model('Poll');

    Poll.find({id: id}, (err, polls) => {
        if (err) {
            res.status(500).send({error: 'something went wrong'});
        } else {
            res.render('vote', {
                poll: polls[0]
            });
        }
    });
});

/**
 * @api {get} /polls/:id/results Get a poll results
 * @apiName GetPollResults
 * @apiGroup Polls
 * @apiParam {String} id Poll id
 * @apiSuccess {String} id Poll id
 * @apiSuccess {String} name Poll name
 * @apiSuccess {Array} options Poll options
 * @apiSuccess {Array} voted Poll voted
 * @apiSuccess {Date} createDate Poll create date
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "id": "5b9d8f9f8f9f9f9f9f9f9f9",
 * "name": "What is your favorite color?",
 * "options": [
 *   {name: "Red", votes: 0},
 * ],
 * "voted": [],
 * "createDate": "2018-01-01T00:00:00.000Z"
 * }
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *  {
 *  "error": "Poll not found"
 * }
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 500 Internal Server Error
 * {
 * "error": "Something went wrong"
 * }
 */
router.get('/:id/results', (req, res) => {
    const { id } = req.params;
    const Poll = mongoose.model('Poll');
   
    Poll.find({id: id}, (err, polls) => {
        if (err) {
            res.status(500).send({error: 'something went wrong'});
        } else {
            res.render('results', {
                poll: polls[0]
            });
        }
    });
    
});

export default router;