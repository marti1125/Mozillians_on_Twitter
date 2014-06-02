/* GET Dashboard */
exports.main = function(req, res){
  res.render('dashboard/main', { title: 'Mozillians on Twitter' });
};
