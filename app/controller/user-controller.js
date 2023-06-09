const User = require('../db/models/Users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const {accesstoken,refreshtoken} = require('../config');
const RefreshTokenModel = require('../db/models/Refresh-token');

class UserController {
    showRegister(req,res) {
        res.render('pages/auth/register')
    };

    async register(req,res){
        const user = new User ({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
          
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
 
  async  adminPage(req,res) {
        const find =req.session.user
        const user = await User.findOne({username:find.username})
        
       //foto
        const image =  req.cookies.filename
        res.render('pages/admin-panel/dashboard', {
            form:image,
            username:user.username
        });
    }


    async login(req,res) {
        try{
        const {username,password} = req.body;
       
        const user = await User.findOne({username:req.body.username});
        const users = await User.findOne({user:req.body.user});
    
        req.session.user = user;
        req.session.users = users;

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
    }catch{
        //
    }
   }

   getRefreshToken(req,res) {
        // if(req.cookies?.jwt) {
        //     console.log('odebrano token');
        //     const refreshToken = req.cookies.accTkn;
        //     jwt.verify(refreshToken, refreshtoken,
        //         (err,user) => {
        //             if(err) {
        //                 console.log('nieautoryzowany');
        //                 return res.status(406).json({ message: 'Unauthorized' });
        //             } else {
        //                 const {username,password} = req.body;
        //                 const user =  User.findOne({username:req.body.username});
        //                 const newAccessToken = jwt.sign({username:user.username},accesstoken,{expiresIn:'5s'});
        //                 console.log('przeslano accestoken');
        //                 //COOKIE
        //                 res.cookie('acccTkn', newAccessToken, { httpOnly: true, 
        //                 sameSite: 'None', secure: true, 
        //                 maxAge: 24 * 60 * 60 * 1000 });
        //                 //res.redirect('/admin')
        //                 //return res.json({accessToken})
        //             }
        //         });
        //     }else{
        //         console.log('nieautoryzowany-2');
        //         return res.status(406).json({ message: 'Unauthorized' });
        //     }
        }
//WYLOGOWANIE
        logout(req,res) {
            res.clearCookie("jwt");
            req.session.destroy();
            res.redirect('/zaloguj')
           // res.clearCookie("accTkn");
        }

//EDYCJA
      async  showEditUserProfile(req,res){
            
            const find =req.session.user
            const users = await User.findOne({username:find.username});
            res.render('pages/editprofile',{
                form: users,
            })
        }   
    
      async  updateProfile (req,res) {
            const find =req.session.user
            const users = await User.findOne({username:find.username});
                users.username = req.body.username;
                users.email = req.body.email;

            if(req.body.password){
                users.password = req.body.password
            }
            
            //FOTO
            const image =  req.cookies.filename
            const path = 'public/uploads/' +  image

            if (req.file ){
                fs.unlink(path, function(err) {
                    if(err && err.code == 'ENOENT'){
                        console.log('nienzaleziono zdjecia')
                    }else{console.log('usunieto');}
                });} 
           
            if(!req.file){
                 console.log('niedziala');
            }else{
                users.image = req.file.filename;
                res.cookie('filename', users.image);
            }
             

            try{
                await users.save();
                req.session.user=users
                res.redirect('/admin')
            } catch(e) {
                res.render('pages/editprofile',{
                errors: e.errors})
            }
        }
        
    
    



        

    calendar(req,res) {
        res.render('pages/admin-panel/calendar')
}

 
    
   
        
        
    }
 module.exports = new UserController();
    
    
