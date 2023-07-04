const express = require('express')

const router = express.Router();



router.get("/", (req,res) => {
    res.render("index")
    });
    router.get("/signup", (req,res) =>{
        res.render("signup")
    });
    router.get("/forgetpass", (req,res) =>{
        res.render("forgetpass")
    });
    module.exports = router;
