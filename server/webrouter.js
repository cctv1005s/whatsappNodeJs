var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');

var jar = request.jar();
request.defaults({jar:jar});

/* GET home page. */
router.get('/', function(req, res, next){

//自动登录
res.render('index');

});


router.post('/login',function(req,res,next){
    try{
    request.post('http://58.246.1.146:59800/Uniwork/web/app.php/Action/Account/Authen',function(err,data,body){
        res.json(body);
    })
    .form(JSON.stringify({ 
    "UserAccount": "11@qq.com",
    "UserPassword": "6512BD43D9CAA6E02C990B0A82652DCA",
    "ExtraInfo": "Uniwork_Client#20800#00346339000000785176#19999"
    }));
    }
    catch(e){
        console.log(e);
    }
});

router.post('/sourceMark',function(req,res,next){
   request.post('http://58.246.1.146:59800/Uniwork/web/app.php/CommonAction/4B474742-170A-4D37-83F5-8DE94524444A/0/CommonUpdate',function(err,data,body){
        res.json(body);
    })
    .form(req.body); 
});

module.exports = router;
