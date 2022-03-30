import mongoose from 'mongoose';

export const pollModel = new mongoose.Schema({
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
    voted: {
        type: Array,
        required: true
    },
    createDate: {
        type: Date,
        required: true
    }
});
