import express from 'express';
import {randomString} from '../utils/idUtil';

import mongoose from 'mongoose';

// import pollModel
import {pollModel} from '../models/pollModel';

const router = express.Router();

/**
 * @api {post} /vote Vote for a poll
 * @apiName Vote
 * @apiGroup Polls
 * @apiParam {String} id Poll id
 * @apiParam {String} option Poll option
 * @apiSuccess {String} id Poll id
 * @apiSuccess {String} name Poll name
 * @apiSuccess {Array} options Poll options
 * @apiSuccess {Array} voted Poll voted
 * @apiSuccess {Date} createDate Poll create date
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 * "id": "5b9d8f9f8f9f9f9f9f9f9f9",
 * "name": "What is your favorite color?",
 * "options": [
 * {name: "Red", votes: 0},
 * ],
 * "voted": [],
 * "createDate": "2018-01-01T00:00:00.000Z"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 * "error": "Poll not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 * "error": "Something went wrong"
 * }
 */
router.post('/vote', (req, res) => {
    const { id, vote } = req.body;
    const ip: String = req.ip;

    const Poll = mongoose.model('Poll');

    Poll.find({id: id}, (err, polls) => {
        if (err) {
            res.status(500).send('something went wrong');
        } else {
            const poll: any = polls[0];
            
            if(poll == null) {
                return res.status(404).send({error: 'poll not found'});
            } 

            if(poll.voted.indexOf(ip) > -1) {
                return res.status(421).send({error: 'already voted'});
            }

            const options = poll.options;
            const option = options.find((option: any) => option.name === vote);
            option.votes++;
            
            const voted = poll.voted;
            voted.push(ip);

            // update poll by id
            Poll.update({id: id}, poll, ((err: any, raw: any) => {
                if (err) {
                    res.status(500).send({error: 'something went wrong'});
                } else {
                    res.send(poll).status(200);
                }
            }));
            
        }
    });


});

/**
 * @api {post} /create Create a new poll
 * @apiName CreatePoll
 * @apiGroup Polls
 * @apiParam {String} name Poll name
 * @apiParam {Array} options Poll options
 * @apiSuccess {String} id Poll id
 * @apiSuccess {String} name Poll name
 * @apiSuccess {Array} options Poll options
 * @apiSuccess {Array} voted Poll voted
 * @apiSuccess {Date} createDate Poll create date
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 
 * "id": "5b9d8f9f8f9f9f9f9f9f9f9",
 * "name": "What is your favorite color?",
 * "options": [
 * {name: "Red", votes: 0},
 * ],
 * "voted": [],
 * "createDate": "2018-01-01T00:00:00.000Z"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 * "error": "Something went wrong"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 * "error": "Invalid options"
 * }
 */
router.post('/create', (req, res) => {
    const { name, options } = req.body;

    // create a new poll with Model
    const Poll = mongoose.model('Poll', pollModel);


    const optionsList: any = [];

    options.forEach((option: any) => {
        optionsList.push({
            name: option,
            votes: 0
        });
    });

    // create a new poll
    const newPoll = new Poll({
        id: randomString(6),
        name,
        options: optionsList,
        createDate: new Date()
    });

    // insert the poll into database
    newPoll.save((err: any, poll: any) => {
        if (err) {
            res.status(500).send({error: 'something went wrong'});
        } else {
            res.status(200).send(poll);
        }
    });

});

export default router;