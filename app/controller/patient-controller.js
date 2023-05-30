const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');
const fs = require('fs'); 




class PatientController {
    async patientList(req,res) {
        //sidebar
        const find =req.session.user
        const image =  req.cookies.filename
        const user = await User.findOne({username:find.username});
        
        //search,sort
        const { q, sort } = req.query 
        const where ={ };
        where.name={ $regex: q || '', $options: 'i'};
        
        let query = Patient.find(where)
        if(sort) {
            const s = sort.split('|');
            query = query.sort({ [s[0]]: s[1] })
        }

        
        const patients = await query.exec();




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

        let patient = new Patient ({
            name:req.body.name,
            email:req.body.email,
            pesel:req.body.pesel,
            phone:req.body.phone,
            address:req.body.address,
            note:req.body.note,
            visit:req.body.visit
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