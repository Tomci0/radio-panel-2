const LOGS = {};

import Logs from "../models/Logs.js";

export default LOGS;

Logs.add_log = async function (type, data, user) {
  try {
    const newLog = new Logs({
      type,
      data,
      user,
    });

    await newLog.save();
    return {
      message: "success - add_log",
      log: newLog._id,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "error - add_log",
      error: error,
    };
  }
};

export const add_log = Logs.add_log;
