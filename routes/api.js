import express from "express";
const router = express.Router();

import User from "../models/User.js";
import Verification from "../models/Verification.js";
import Queue from "../models/Queue.js";

import { isAdmin } from "../middleware/check.js";

router.get("/", function (req, res, next) {
  res.json({
    message: "Welcome to the API - ZS 14 Radio",
    author: "Tomci0 (kontakt@tomcio.space)",
  });
});

// ADMIN ROUTES

import getAdminData from "./admin/api/getAdminData.js";
import getQueue from "./admin/api/getQueue.js";
import {
  verify_accept,
  verify_decline,
  verify_get,
} from "./admin/api/verification.js";

router.get("/getAdminData", isAdmin, getAdminData);
router.get("/getQueue", isAdmin, getQueue);
router.get("/verification/accept", isAdmin, verify_accept);
router.get("/verification/decline", isAdmin, verify_decline);
router.get("/verification/get", isAdmin, verify_get);

export default router;
