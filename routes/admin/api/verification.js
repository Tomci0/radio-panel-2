import Verification from "../../../models/Verification.js";

import { add_log } from "../../../libs/logs.js";

export const verify_accept = async function (req, res) {
  const { verify_id } = req.body;

  const verification = await Verification.findOne({ _id: verify_id });

  if (!verification) {
    return res.json({
      message: "error - verify_accept",
      error: "Verification not found",
    });
  }

  try {
    await Verification.deleteOne({ _id: verify_id });
    res.status(200).json({ message: "verification accepted." });
  } catch (error) {
    res.status(500).json({ message: "error - verify_accept", error: error });
    console.error(error);
  }

  add_log("verification_accept", verification, req.user._id);

  res.json({
    message: "success - verify_accept",
  });
};

export const verify_decline = async function (req, res) {
  const { verify_id } = req.body;

  const verification = await Verification.findOne({ _id: verify_id });

  if (!verification) {
    return res.json({
      message: "error - verify_decline",
      error: "Verification not found",
    });
  }

  try {
    await Verification.deleteOne({ _id: verify_id });
    res.status(200).json({ message: "verification declined." });
  } catch (error) {
    res.status(500).json({ message: "error - verify_decline", error: error });
    console.error(error);
  }

  add_log("verification_decline", verification, req.user._id);

  res.json({
    message: "success - verify_decline",
  });
};

export const verify_get = async function (req, res) {
  const Verifications = await Verification.find()
    .populate("song")
    .populate("author");

  res.json({
    message: "success - getVerifications",
    verifications: Verifications,
  });
};

export default async function () {
  return {
    verify_accept,
    verify_decline,
    verify_get,
  };
}
