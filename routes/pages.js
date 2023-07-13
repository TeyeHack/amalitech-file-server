const express = require('express');


const authController = require('../controllers/auth');


const router = express.Router();





router.get("/", (req,res) => {
    res.render("index")
    });
    router.get("/signup", (req,res) =>{
        res.render("signup")
    });
    router.get("/adminlogin", (req,res) =>{
        res.render("adminlogin")
    });
    router.get("/forgetpass", (req,res) =>{
        res.render("forgetpass")
    });
   
      router.get("/logout", (req, res)=>{
        res.render("index")
    });

    module.exports = router;