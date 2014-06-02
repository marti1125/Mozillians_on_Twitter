/* GET home page. */
exports.login = function(req, res){
  res.render('security/login', { title: 'Mozillians on Twitter' });
};
