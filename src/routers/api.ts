import express from 'express';
import {randomString} from '../utils/idUtil';

import mongoose from 'mongoose';

// import pollModel
import {pollModel} from '../models/pollModel';

const router = express.Router();


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