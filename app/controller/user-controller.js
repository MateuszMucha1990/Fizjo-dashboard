const User = require('../db/models/Users');
const jwt = require('jsonwebtoken');
const {accesstoken,refreshtoken} = require('../config');
const RefreshTokenModel = require('../db/models/Refresh-token');
const cookieParser = require('cookie-parser');




    const accessTkn=(id) => {
        return jwt.sign({userID:id},accesstoken,{expiresIn:'15s'})
    };
    const refreshTkn=(id) => {
        return jwt.sign({userID:id},refreshtoken);
    };
    //let RefreshTokenArray=[];


 
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

    // dashboard(req,res){
    //     res.render('pages/admin-panel/dashboard');
    // }

    // showLogin(req,res) {
    //     res.render('pages/auth/login')
    // }
    showLogin(req,res) {
        res.render('pages/admin-panel/dashboard')
    }

    async login(req,res) {
         const {username,password} = req.body;
         const user = await User.findOne({username:req.body.username});
         
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
        }

    
        const token = accessTkn(user._id);
        const Refresh_token = refreshTkn(user._id);
        
        console.log('dziala');
        const find_token_in_schema = await RefreshTokenModel.findOne({user:user._id});
        
        if(!find_token_in_schema){
           const refreshTokenmodel = new RefreshTokenModel({
                token: Refresh_token,
                user:user._id
           });
          await refreshTokenmodel.save();
        }else{
            let new_token= await RefreshTokenModel.findOneAndDelete({user:user._id},{token:Refresh_token},{new:true})
        }
        
        // RefreshTokenArray.push(Refresh_token);

        //res.json({user,token,Refresh_token});
        //res.render('pages/admin-panel/dashboard');



        // res.cookie("Refresh_token",Refresh_token,{
        //     httpOnly:true
        // }); 
        res.cookie("token",token,{
            httpOnly:true
        });
        return res.redirect('/admin')
    } 


    async getRefreshToken(req,res) {
        const refresh_Tkn = req.body.refresh_token;
        if(!refresh_Tkn){
            console.log('"Token jest wymagany!"');
            return res.status(401).json("Token jest wymagany!");
        }

        const decode = jwt.verify(refresh_Tkn,refreshtoken);
        if(!decode){
            console.log("Niepoprawny token");
            return res.status(403).json("Niepoprawny token");
        }
        const user_id = decode.userId;
        
        //const find_token = RefreshTokenArray.find(token => token===refresh_Tkn);
        const find_token = await RefreshTokenModel.findOne({token:refresh_Tkn});
       
        if(!find_token)
        {
            console.log("Token wygasł. Zaloguj się ponownie");
            return res.status(403).json("Token wygasł. Zaloguj się ponownie");
        }else{
          //  RefreshTokenArray=RefreshTokenArray.filter(token=>token!==refresh_Tkn)
            const token = accessTkn(user_id);
            const Refresh_token = refreshTkn(user_id);
            let new_token = await RefreshTokenModel.findOneAndUpdate({token:refresh_Tkn},{token:Refresh_token},{new:true});

          //  RefreshTokenArray.push(Refresh_token);
          res.cookie("Refresh_token",Refresh_token,{
            httpOnly:true
        });
          
          return res.status(200).json({token,Refresh_token});
        }
        
}
}

module.exports = new UserController();
