const User = require('../db/models/Users');
const Patient = require('../db/models/Patients')

class StatController {
   async statistics(req,res){
        //sidebar
        const find =req.session.user
        const image =  req.cookies.filename
        const user = await User.findOne({username:find.username});
        const userId=user._id

        //  ODNOSNIE DATY DODANIA PACJENTA-- do zmiany!!!!!
        const patient = await Patient.find();
        const thisYearPatients =patient.map(item => item.added);

        const datesInCurrentYear = (thisYearPatients.filter(dateString => {
            const date = new Date(dateString);
            return date.getFullYear() === new Date().getFullYear();
        })).length;



        res.render('pages/admin-panel/statistic',{
            username:user.username,
            form:image,
            datesInCurrentYear
        })
    }
}

module.exports = new StatController()