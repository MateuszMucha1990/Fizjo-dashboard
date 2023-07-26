const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');

class CalendarController {
    async calendar(req,res){
        const image =  req.cookies.filename
        const user = await User.findOne({username:req.session.user.username});

        res.render('pages/admin-panel/calendar',{
            username:user.username,
            form:image
        });
    }

    async today(req,res){
        const image =  req.cookies.filename
        const user = await User.findOne({username:req.session.user.username});

        res.render('pages/admin-panel/calendar',{
            username:user.username,
            form:image
        });
    }





}

module.exports = new CalendarController()