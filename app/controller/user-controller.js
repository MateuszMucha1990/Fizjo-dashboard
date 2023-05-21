const User = require('../db/models/Users');
const jwt = require('jsonwebtoken');
const {accesstoken,refreshtoken} = require('../config');
const RefreshTokenModel = require('../db/models/Refresh-token');
const cookieParser = require('cookie-parser');

class UserController {
    showRegister(req,res) {
        res.render('pages/auth/register')
    };

    async register(req,res){
        const user = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        try {
            await user.save();
            res.redirect('/zaloguj');

        } catch (err) {
            res.render('pages/auth/register',{
                errors:err.errors,
                form:req.body
            })
        }
    }

    home(req,res) {
        res.render('pages/login')
    }
 
    adminPage(req,res) {
        res.render('pages/admin-panel/dashboard')
    }


    async login(req,res) {
        const {username,password} = req.body;
        const user = await User.findOne({username:req.body.username});
        console.log('username: ' + user.username);
        if (!user) {
           console.log('niedziala');
           return  res.render('pages/login',{
               error:"Nieprawidłowy login"
           })
       } 
       if (user.password != password) {
           console.log('nie to haslo');
           return res.render('pages/login',{
           error:"Nieprawidłowe hasło"});
       }else {


           //TOKENS
       const accessToken = jwt.sign({username:user.username},accesstoken,{expiresIn:'5s'})
       const refreshToken  = jwt.sign({username:user.username},refreshtoken) 
           //COOKIE
        res.cookie('jwt', refreshToken, { httpOnly: true, 
           sameSite: 'None', secure: true, 
           maxAge: 24 * 60 * 60 * 1000 });

           console.log('wyslalo acctokena');
           
           res.cookie('accTkn', accessToken, { httpOnly: true, 
            sameSite: 'None', secure: true, 
            maxAge: 24 * 60 * 60 * 1000 });
            // res.json({ accessToken: accessToken, refreshToken: refreshToken })
           
             res.redirect('/admin')
        };
   }

   getRefreshToken(req,res) {
        if(req.cookies?.jwt) {
            console.log('odebrano token');
            const refreshToken = req.cookies.jwt;
            jwt.verify(refreshToken, refreshtoken,
                (err,user) => {
                    if(err) {
                        console.log('nieautoryzowany');
                        return res.status(406).json({ message: 'Unauthorized' });
                    } else {
                        const {username,password} = req.body;
                        const user =  User.findOne({username:req.body.username});
                        const newAccessToken = jwt.sign({username:user.username},accesstoken,{expiresIn:'5s'});
                        console.log('przeslano accestoken');
                        //COOKIE
                        res.cookie('acccTkn', newAccessToken, { httpOnly: true, 
                        sameSite: 'None', secure: true, 
                        maxAge: 24 * 60 * 60 * 1000 });

                        //res.redirect('/admin')
                        //return res.json({accessToken})
                     
                    }
                });
            }else{
                console.log('nieautoryzowany-2');
                return res.status(406).json({ message: 'Unauthorized' });
            }
        }

    calendar(req,res) {
        res.render('pages/admin-panel/calendar')
    }

 
    
   
        
        
    }
 module.exports = new UserController();
    
    
