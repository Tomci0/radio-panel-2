import User from '../../../models/User.js';
import Verification from '../../../models/Verification.js';
import Queue from '../../../models/Queue.js';

export default async function(req, res, next) {
    const findUser = (await User.find()).sort((a,b) => {
        return b.created - a.created
    });

    res.json({
        newestUser: findUser[0].given_name,
        allUsers: findUser.length,
        allVerifications: (await Verification.find()).length,
        allQueue: (await Queue.find()).length,
    });
};