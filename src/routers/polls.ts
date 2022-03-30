import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

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