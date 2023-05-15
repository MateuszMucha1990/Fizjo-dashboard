const User = require('../db/models/Users');
const jwt = require('jsonwebtoken');
const {accesstoken} = require('../config')



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

    dashboard(req,res){
       // res.send('udalo sie, witam w panelu admina');
        res.render('pages/admin-panel/dashboard')
    }

    showLogin(req,res) {
        res.render('pages/auth/login')
    }

    async login(req,res) {
        const {username} = req.body;
        const user = await User.findOne({username});
        
        user.username = req.body.username

        if (!user) {
            return res.sendStatus(401)
        }

        const payload = {username: user.username};
        const token = jwt.sign(payload,accesstoken)

        res.json({token})

    } 


}

module.exports = new UserController();
