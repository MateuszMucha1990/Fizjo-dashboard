module.exports = function(req,res,next) {
    res.locals.users = req.session.users
    next();
}