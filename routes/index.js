var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if (!req.session.loggedIn) {
		res.redirect('/login');
	} else {
		res.render('index', { title: 'Express' });
	}  
  //res.send('if you are viewing this page it means you are logged in');
});

module.exports = router;
