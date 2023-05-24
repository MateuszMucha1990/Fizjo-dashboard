module.exports = function(req, res, next) {
    if (!req.session.users) {
     return res.redirect('/zaloguj');
    }
     next();
 }