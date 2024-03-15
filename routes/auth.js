import express from "express";
import passport from "passport";
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] } ));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' } ), function (req, res) {
    res.redirect('/')
});

router.get('/failed', (req, res) => {
    res.send('You failed to login')
})

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('info', 'Zostałeś wylogowany.')
        res.redirect('/');
    });
});

export default router;