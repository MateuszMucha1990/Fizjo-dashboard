const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');
const fs = require('fs'); 




class PatientController {
    async patientList(req,res) {
        const find =req.session.user
        const image =  req.cookies.filename
        const user = await User.findOne({username:find.username});
        
        //search
        const { q } = req.query 
        const where ={ };
        where.name={ $regex: q || '', $options: 'i'};
        const patients = await Patient.find(where);

        res.render('pages/admin-panel/patientlist', {
            form:image,
            username:user.username,
            patients
        });
    }


   async registerPatient(req,res) {
        const find =req.session.user
        const user = await User.findOne({username:find.username});

        const image =  req.cookies.filename
        res.render('pages/admin-panel/patient/patientRegistration', {
            form:image,
            username:user.username
        });
    }

   async addPatient (req,res) {
        const find =req.session.user
        const user = await User.findOne({username:find.username});

        const patient = new Patient ({
            name:req.body.name,
            email:req.body.email,
            pesel:req.body.pesel,
            phone:req.body.phone,
            address:req.body.address,
            note:req.body.note,
        });

        try {
            await patient.save();
            res.redirect('/admin/pacjenci')
        }catch(e){
            res.render('pages/admin-panel/patient/patientRegistration',{
                errors:e.errors,
                form:req.body,
                username:user.username
            })
        }
    }


}

module.exports = new PatientController();