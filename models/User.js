import mongoose from 'mongoose';

let Users = new mongoose.Schema({
    googleId: { type: String, required: true },
    given_name: { type: String, required: true },
    mail: { type: String, required: true },
    picture: { type: String, required: true },
    blocked: { type: Boolean, required: true },
    role: { type: String, required: true },
    created: { type: Number, required: true },
});

const model = mongoose.model("users", Users);

export default model;