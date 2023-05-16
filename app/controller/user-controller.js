const User = require('../db/models/Users');
const jwt = require('jsonwebtoken');
const {accesstoken,refreshtoken} = require('../config');
const RefreshTokenModel = require('../db/models/Refresh-token');

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
            res.redirect('/');

        } catch (err) {
            res.render('pages/auth/register',{
                errors:err.errors,
                form:req.body
            })
        }
    }

    dashboard(req,res){
        res.render('pages/admin-panel/dashboard');
    }

    // showLogin(req,res) {
    //     res.render('pages/auth/login')
    // }

    async login(req,res) {
        const {username} = req.body;
        const user = await User.findOne({username});
        user.username = req.body.username
        //const payload = {username: user.username};
        
        if (!user) {
            return res.sendStatus(401)
        }
        const token = accessTkn(user._id);
        const Refresh_token = refreshTkn(user._id);

        const find_token_in_schema = await RefreshTokenModel.findOne({user:user._id});
        console.log(find_token_in_schema);
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

        res.json({user,token,Refresh_token});
        
    } 


    async getRefreshToken(req,res) {
        const refresh_Tkn = req.body.refresh_token;
        if(!refresh_Tkn){
            return res.status(401).json("Token jest wymagany!");
        }

        const decode = jwt.verify(refresh_Tkn,refreshtoken);
        if(!decode){
            return res.status(403).json("Niepoprawny token");
        }

        const user_id = decode.userId;
        
        //const find_token = RefreshTokenArray.find(token => token===refresh_Tkn);
        const find_token = await RefreshTokenModel.findOne({token:refresh_Tkn});
       
        if(!find_token)
        {
            return res.status(403).json("Token wygasł. Zaloguj się ponownie");
        }else{
          //  RefreshTokenArray=RefreshTokenArray.filter(token=>token!==refresh_Tkn)
            const token = accessTkn(user_id);
            const Refresh_token = refreshTkn(user_id);
            let new_token = await RefreshTokenModel.findOneAndUpdate({token:refresh_Tkn},{token:Refresh_token},{new:true});

          //  RefreshTokenArray.push(Refresh_token);

         return res.status(200).json({token,Refresh_token});
    }

}
}

module.exports = new UserController();
