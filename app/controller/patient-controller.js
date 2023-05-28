const User = require('../db/models/Users');

class PatientController {
    async patientList(req,res) {
        const { q } = req.query
        const find =req.session.user
        const user = await User.findOne({username:find.username});

        const image =  req.cookies.filename
        res.render('pages/admin-panel/patientlist', {
            form:image,
            username:user.username
        });

        // wyszukiwanie pacjentow 7:54

    }

   async addPatient(req,res) {
    const find =req.session.user
    const user = await User.findOne({username:find.username});

    const image =  req.cookies.filename
    res.render('pages/admin-panel/patient/patientRegistration', {
        form:image,
        username:user.username
    });
      
    }


}

module.exports = new PatientController();