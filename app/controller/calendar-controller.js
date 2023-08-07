const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');
const Calendar_visit = require('../db/models/Calendar-visit');

class CalendarController {
    async calendar(req,res){
        const image =  req.cookies.filename
        const user = await User.findOne({username:req.session.user.username});
        const allAppointments = await Calendar_visit.find({});

         //console.log('reqbody '+JSON.stringify(req.query));
       console.log(req.query);

        res.render('pages/admin-panel/calendar',{
            username:user.username,
            form:image,
            allAppointments
        });
    }






    async today(req,res){
        const image =  req.cookies.filename
        const user = await User.findOne({username:req.session.user.username});
        const allAppointments = await Calendar_visit.find({});
      //  console.log('reqbody '+JSON.stringify(req.body));

        let eventsArr = new Calendar_visit( {
            day:JSON.stringify(req.body.day),
            month:JSON.stringify(req.body.month),
            year:JSON.stringify(req.body.year),
            // events:[{
            //     title:JSON.stringify(req.body.title),
            //     time:JSON.stringify(req.body.time),
            // }]
        })
       // console.log('eve'+ eventsArr);
        try{
            await eventsArr.save();   
            console.log('zapisalo');
            res.render('pages/admin-panel/calendar',{
                username:user.username,
                form:image,
                allAppointments
            });
            
        }catch(e){
            //
        }
    }

//     async addAppointment(req,res){
//         const image =  req.cookies.filename
//         const user = await User.findOne({username:req.session.user.username});
// console.log('reqbody '+req.body);
//         let eventsArr = new Calendar_visit( {
//             day:1,
//             month:8,
//             year:2023,
//             events:[{
//                 title:req.body.event_name,
//                 time:req.body.event_time_from,
//             }]
//         })
//         console.log('eve'+ eventsArr);
//         try{
//             await eventsArr.save();   
//             console.log('zapisalo');
//             res.render('pages/admin-panel/calendar',{
//                 username:user.username,
//                 form:image
//             });
            
//         }catch(e){
//             //
//         }
//     }


















        // const eventsArr = new Calendar_visit( 
        //     {
        //         day:2,
        //         month: 8,
        //         year: 2023,
        //         events: [
        //             {
        //                 title:" Andrzej Załucja",
        //                 time:"10:00",
        //             },
        //         ],
        //     });
        //     try{
        //         await eventsArr.save();   
        //         console.log('zapisalo');
        //         res.render('pages/admin-panel/calendar',{
        //             username:user.username,
        //             form:image
        //         });

        //     }catch(e){
        //        //
        //     }





}

module.exports = new CalendarController()