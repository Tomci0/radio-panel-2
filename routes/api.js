import express from "express";
const router = express.Router();

import User from '../models/User.js';
import Verification from '../models/Verification.js';
import Queue from '../models/Queue.js';

import { isAdmin } from "../middleware/check.js";

router.get('/', function(req, res, next) {
    res.json({
        message: 'Welcome to the API - ZS 14 Radio',
        author: 'Tomci0 (kontakt@tomcio.space)'
    });
});

router.get('/getAdminData', isAdmin, async function(req, res, next) {
    const findUser = (await User.find()).sort((a,b) => {
        return b.created - a.created
    });

    res.json({
        newestUser: findUser[0].given_name,
        allUsers: findUser.length,
        allVerifications: (await Verification.find()).length,
        allQueue: (await Queue.find()).length,
    });
});

export default router;