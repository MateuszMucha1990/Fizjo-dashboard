const jwt = require('jsonwebtoken');
const {accesstoken,refreshtoken} = require('../../config');


const authMiddleware =(req,res, next) =>{
    //const token = req.headers['authorization']?.split(' ')[1];
    const accessToken = req.cookies.jwt;
    if(!accessToken) {
        //return res.sendStatus(401);
        console.log('nieznaleziono tokenu');
        return res.redirect('/zaloguj');
    }
    
    jwt.verify(accessToken,refreshtoken, (err,user) =>{
        if (err) {
            // return res.sendStatus(403);
            console.log('zla weryfikacja');
     
            return res.redirect('/zaloguj');
        }
        req.user = user;
     
        //console.log(req.session);
        res.clearCookie("accTkn");
        next();
    })

}
module.exports = authMiddleware;
// const authMiddleware =(req,res, next) =>{
//     //const token = req.headers['authorization']?.split(' ')[1];
//     const accessToken = req.cookies.accessToken;
//     if(!accessToken) {
//         //return res.sendStatus(401);
//         console.log('nieznaleziono tokenu');
//         return res.redirect('/zaloguj');
//     }
    
//     jwt.verify(accessToken,accesstoken, (err,data) =>{
//         if (err) {
//             // return res.sendStatus(403);
//             console.log('zla weryfikacja');
//            // res.clearCookie("token");
//             return res.redirect('/zaloguj');
//         }
//         req.user = data;
//         //res.clearCookie("token");
    
//         next();
//     })

// }
// module.exports = authMiddleware;