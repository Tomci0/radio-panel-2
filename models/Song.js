import mongoose from 'mongoose';

let Song = new mongoose.Schema({
    songId: { type: String, required: true },
    title: { type: String, required: true },
    authors: { type: String },
    thumbnail: { type: String, required: true },
    duration: { type: Number, required: true },
    verified: { type: Boolean, default: false },
});

const model = mongoose.model("songs", Song);

export default model;