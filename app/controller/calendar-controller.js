const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');
const Calendar_visit = require('../db/models/Calendar-visit');

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

        const eventsArr = new Calendar_visit( 
            {
                day:2,
                month: 8,
                year: 2023,
                events: [
                    {
                        title:" Andrzej Załucja",
                        time:"10:00",
                    },
                ],
            });
            try{
                await eventsArr.save();   
                console.log('zapisalo');
                res.render('pages/admin-panel/calendar',{
                    username:user.username,
                    form:image
                });

            }catch(e){
               //
            }
    }





}

module.exports = new CalendarController()