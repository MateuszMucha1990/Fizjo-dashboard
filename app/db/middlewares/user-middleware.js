module.exports = function(req,res,next) {
    //res.locals.users = req.session.users;
    res.locals.user = req.session.user;
    res.locals.form = {};
  
    next();
}