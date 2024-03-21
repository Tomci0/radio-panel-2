import express from "express";
const router = express.Router();

import { isAdmin } from "../../middleware/check.js";

router.get('/*', isAdmin, function(req, res, next) {
    res.render('admin/index');
});

export default router;