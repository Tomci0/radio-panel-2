import { Strategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

export default new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async function(accessToken, refreshToken, profile, cb) {
        let userProfile = {};
        const findUser = await User.findOne({
            mail: profile._json.email
        });

        if (findUser) {
            userProfile = {
                _id: findUser._id,
                given_name: profile._json.given_name,
                googleId: profile._json.sub,
                email: profile._json.email,
                picture: profile._json.picture,
                blocked: findUser.blocked,
                role: findUser.role,
                created: findUser.created,
                isAdmin: findUser?.role === 'admin' ? true : false,
                isLogged: true
            }

            User.updateOne({ googleId: profile._json.sub }, {
                $set: {
                    given_name: profile._json.given_name,
                    mail: profile._json.email,
                    picture: profile._json.picture,
                }
            });
        } else {
            const newUser = new User({
                googleId: profile._json.sub,
                given_name: profile._json.given_name,
                mail: profile._json.email,
                picture: profile._json.picture,
                blocked: false,
                role: 'user',
                created: Date.now()
            });

            newUser.save();

            userProfile = {
                _id: newUser._id,
                given_name: profile._json.given_name,
                googleId: profile._json.sub,
                email: profile._json.email,
                picture: profile._json.picture,
                blocked: false,
                role: 'user',
                created: Date.now(),
                isAdmin: findUser?.role === 'admin' ? true : false,
                isLogged: true
            }
        }

        return cb(null, userProfile);
    }
);