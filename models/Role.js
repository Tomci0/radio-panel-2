import mongoose from 'mongoose';

let Role = new mongoose.Schema({
    name: { type: String, required: true },
    permissions: { type: Array, required: true },
    created: { type: Number, required: true },
});

const model = mongoose.model("roles", Role);

export default model;