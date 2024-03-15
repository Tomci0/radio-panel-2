import express from "express";
const router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.user)
    res.render('admin/index');
});

export default router;