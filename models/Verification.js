import mongoose from 'mongoose';

let Verifications = new mongoose.Schema({
    song: { type: mongoose.Schema.Types.ObjectId, ref: 'songs', required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    timestamp: { type: mongoose.Schema.Types.Date, required: true },
});

const model = mongoose.model("verifications", Verifications);

export default model;