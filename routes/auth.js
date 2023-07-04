const express = require('express');

const authController = require('../controllers/auth');
const loginController = require('../controllers/auth');

const router = express.Router();

router.post("/signup", loginController.register); //ch
    router.post("/index", loginController.login); //ch

   /* router.get("/forgetpass", (req,res) =>{
        res.render("forgetpass")
    });**/
    module.exports = router;
