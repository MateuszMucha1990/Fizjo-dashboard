module.exports = function(req,res,next) {
    //res.locals.users = req.session.users;
    res.locals.user = req.session.user;
    res.locals.patient = req.session.patient; 
   // res.locals.visit = req.session.visit; //???
    res.locals.form = {};
    res.locals.query = req.query;
  
    next();
}