const User = require('../db/models/Users');




class PageController {
    home(req,res) {
        res.render('pages/login', {   
        })
    }

   async patientList(req,res) {
        const find =req.session.user
        const user = await User.findOne({username:find.username});

        const image =  req.cookies.filename
        res.render('pages/admin-panel/patientlist', {
            form:image,
            username:user.username
        });
    }


}

module.exports = new PageController();