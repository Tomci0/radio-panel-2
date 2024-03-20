import express, { query } from "express";
const router = express.Router();

import * as yt from 'youtube-search-scrapper';

import Song from '../../models/Song.js';
import Verification from '../../models/Verification.js';

router.get('/', function(req, res, next) {
    res.render('index/request');
});

router.get('/search', async function(req, res, next) {
    if (!req.user) {
        res.status(401).json({ message: 'unauthorized' });
        return;
    }
    if (!req.query.q) {
        res.status(400).json({ message: 'query is required' });
        return;
    }
    const search = await yt.search(req.query.q.split('?si')[0]);
    req.session.cachedSounds = search;
    res.json({ message: 'searching for ' + req.query.q.split('?si')[0], data: search });
});

router.post('/send', async function(req, res, next) {
    if (!req.user) {
        res.status(401).json({ message: 'unauthorized' });
        return;
    }

    if (!req.body.songId) return res.status(400).json({ message: 'songId is required' });

    if (req.session.nextRequest > Date.now()) {
        res.status(429).json({ message: 'too many requests', code: 'too_many_requests' });
        return;
    }
    
    if (!req.session.cachedSounds) return res.status(400).json({ message: 'search for song first' });

    const songData = req.session.cachedSounds.find(s => s.id.videoId === req.body.songId);

    if (!songData) {
        res.status(400).json({ message: 'song not found' });
        return;
    }
    // send request 

    let findSong = await Song.findOne({ songId: req.body.songId });
    
    if (!findSong) {
        try {
            let song = new Song({
                songId: req.body.songId,
                title: songData.title,
                thumbnail: songData.snippet.thumbnails.length && songData.snippet.thumbnails[0].url || songData.snippet.thumbnails.url,
                duration: Number(songData.duration_raw.split(':')[0]*60) + Number(songData.duration_raw.split(':')[1]),
            });
        
            await song.save();
            findSong = song;
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'internal server error' });
            return;
        }
    }

    try {
        const newVerification = new Verification({
            song: findSong._id,
            author: req.user._id,
            timestamp: Date.now()
        });

    
        await newVerification.save();
        req.session.nextRequest = Date.now() + 5 * 60 * 1000;
        res.json({ message: 'request sent', status: 200 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'internal server error' });
        return;
    }
});

export default router;