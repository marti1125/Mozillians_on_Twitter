var express = require('express');
var router = express.Router();

exports.login = function(req, res){
	res.render('login',{page_title:"Login"});
};

/*Login post*/
exports.validate = function(req,res){
	var post = req.body;	
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM user WHERE email = ?',[post.email],function(err,rows){
			if(!err) {
				req.session.loggedIn = true;
	    		res.redirect('/users');			
			} else {
				res.redirect('/login');
			}
		});	
	});

	/*if (post.email == 'abc') {
		req.session.loggedIn = true;
	    res.redirect('/users');	    
	} else {	  
	    res.redirect('/login');
	}*/
};

exports.logout = function(req, res){
	delete req.session.user_id;
  	res.redirect('/login');
};

//module.exports = router;
