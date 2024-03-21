import Queue from "../../../models/Queue.js";
import fetch from "node-fetch";

export default async function (req, res, next) {
  const queue = await get_queue();

  if (queue) {
    res.json({
      message: "success - getQueue",
      queue: queue,
    });
  } else {
    try {
      const gueue_db = await Queue.find().populate("song").populate("author");

      if (gueue_db) {
        res.json({
          message: "success - getQueue",
          queue: gueue_db,
        });
      } else {
        res.json({
          message: "error - getQueue",
          error: "Queue not found",
        });
      }
    } catch (error) {
      res.json({
        message: "error - getQueue",
        error: error,
      });
    }
  }
}

const get_queue = async function () {
  const response = await fetch(`${process.env.PlayerURL}/queue/list`, {
    method: "GET",
  });

  if (response.status != 200) {
    return false;
  } else {
    return response.json().data;
  }
};
