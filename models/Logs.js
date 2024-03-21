import mongoose from "mongoose";

let Logs = new mongoose.Schema({
  type: { type: String, required: true },
  data: { type: Object, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  timestamp: { type: Number, required: true, default: Date.now },
});

const model = mongoose.model("logs", Logs);

export default model;
