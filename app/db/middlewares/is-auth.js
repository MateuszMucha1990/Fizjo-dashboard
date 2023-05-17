const jwt = require('jsonwebtoken');
const {accesstoken} = require('../../config');


const authMiddleware =(req,res, next) =>{
    //const token = req.headers['authorization']?.split(' ')[1];
    const token = req.cookies.token;
    if(!token) {
        //return res.sendStatus(401);
        console.log('nieznaleziono tokenu');
        return res.redirect('/zaloguj');
    }
    // const user = jwt.verify(token,accesstoken)
    //     if (err) {
    //         // return res.sendStatus(403);
    //         console.log('zla weryfikacja');
    //         res.clearCookie("token")
    //         return res.redirect('/zaloguj');
    //     }
    //     req.user = user;

    //     next();
    
    jwt.verify(token,accesstoken, (err,data) =>{
        if (err) {
            // return res.sendStatus(403);
            console.log('zla weryfikacja');
            res.clearCookie("token");
            return res.redirect('/zaloguj');
        }
        req.user = data;
        
        next();
    })

}
module.exports = authMiddleware;