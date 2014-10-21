var express = require('express');
var router = express.Router();

/* GET users listing. */
/*router.get('/', function(req, res) {
  res.send('respond with a resource');
});*/

//module.exports = router;


/*
* GET users listing.
*/
exports.list = function(req, res){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM user',function(err,rows){
			if(!err) {
				res.render('users',{page_title:"Users",data:rows});
			} else {
				console.log("Error Selecting : %s ",err );
			}
		});	
	});
};

exports.add = function(req, res){
	res.render('add_user',{page_title:"Add User"});
};

exports.edit = function(req, res){
	var id = req.params.id;
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM user WHERE id = ?',[id],function(err,rows){
			if(!err) {				
				res.render('edit_user',{page_title:"Edit User",data:rows});
			} else {
				console.log("Error Selecting : %s ",err );
			}
		});	
	});
};

exports.add = function(req, res){
	res.render('add_user',{page_title:"Add User"});
};

exports.edit = function(req, res){
	var id = req.params.id;
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM user WHERE id = ?',[id],function(err,rows){
			if(!err) {				
				res.render('edit_user',{page_title:"Edit User",data:rows});
			} else {
				console.log("Error Selecting : %s ",err );
			}
		});	
	});
};

/*Save the customer*/
exports.save = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	req.getConnection(function (err, connection) {
		var data = {
			email : input.email,
			twitter_account : input.twitter_account
		};
		var query = connection.query("INSERT INTO user set ? ",data, function(err, rows){
			if (!err) {				
				res.redirect('/users');
			} else {
				console.log("Error inserting : %s ",err );
			}
		});
	});
};

exports.save_edit = function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var id = req.params.id;
	req.getConnection(function (err, connection) {
		var data = {
			email : input.email,
			twitter_account : input.twitter_account
		};
		connection.query("UPDATE user set ? WHERE id = ? ",[data,id], function(err, rows){
			if (!err) {				
				res.redirect('/users');
			} else {
				console.log("Error Updating : %s ",err );
			}
		});
	});
};

exports.delete_user = function(req,res){
	var id = req.params.id;
	req.getConnection(function (err, connection) {
		connection.query("DELETE FROM user WHERE id = ? ",[id], function(err, rows){
			if(!err){				
				res.redirect('/users');
			} else {
				console.log("Error deleting : %s ",err );
			}
		});
	});
};

