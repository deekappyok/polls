// create a mongoose poll scheme with id, options, votes and createDate
import mongoose from 'mongoose';

export const pollScheme = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    }
});
