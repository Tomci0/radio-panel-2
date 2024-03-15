import exp from 'constants';
import mongoose from 'mongoose';

let Queue = new mongoose.Schema({
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'songs', required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    lp: { type: Number, required: true },
});

const model = mongoose.model("queue", Queue);

export default model;