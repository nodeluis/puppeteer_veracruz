var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var token="";
var pes="";
var raiz="";

router.get('/home2', function(req, res, next) {
  console.log(req.query);
  token=req.query.token;
  res.redirect('/home');
});

router.get('/home', function(req, res, next) {
  res.render('home.ejs',{token:token});
});

router.get('/veracruz2', function(req, res, next) {
  console.log('token por parametro');
  console.log(req.query);
  token=req.query.token;
  res.redirect('/veracruz');
});

router.get('/veracruz', function(req, res, next) {
  res.render('vistas.ejs',{token:token});
});

module.exports = router;
