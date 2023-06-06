const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');
const fs = require('fs'); 




class PatientController {
    async patientList(req,res) {
        //sidebar
        const find =req.session.user
        const image =  req.cookies.filename
        const user = await User.findOne({username:find.username});
        

        const { q, sort } = req.query 
        const page = req.query.page || 1;
        const perPage= 3;

        const where ={ };
        where.name={ $regex: q || '', $options: 'i'};
        
        //search
        let query = Patient.find(where)

        //sort
        if(sort) {
            const s = sort.split('|');
            query = query.sort({ [s[0]]: s[1] })
        }

        //pagination
        query = query.skip((page-1)*perPage);
        query = query.limit(perPage)

        //exec
        const patients = await query.exec();
        const resultsCount = await Patient.find(where).count();
        const pagesCount = (Math.ceil(resultsCount / perPage))

        res.render('pages/admin-panel/patientlist', {
            form:image,
            username:user.username,
            patients,
            title:patients.name,
            page,
            pagesCount,
            resultsCount
        });
    }


   async registerPatient(req,res) {
        const find =req.session.user
        const user = await User.findOne({username:find.username});
        const image =  req.cookies.filename;

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

   async patientCard(req,res) {
        //sidebar-user
       const find =req.session.user
       const user = await User.findOne({username:find.username});
       const image =  req.cookies.filename;

       //patient
       const {name} = req.params;
       const patient = await Patient.findOne({name});

        res.render('pages/admin-panel/patient/patientCard',{
            form:image,
            username:user.username,
           
            title:patient?.name,
            name,
            email:patient.email,
            phone:patient.phone,
            address:patient.address,

            visitSubsc:patient.visitSubsc,
            visitdone:patient.visitSubsc
        });
    }


    async patientVisit(req,res) {
        const {name} = req.params;
        const patient = await Patient.findOne({name});


        res.render('pages/admin-panel/patient/patientVisit',{
            name,
        });
    }

    async newVisit (req, res) {
        const {name} = req.params;
        const patient = await Patient.findOneAndUpdate(
            {name},
            {$push:{"visitSubsc":req.body} }
            );
            res.redirect('/admin/pacjenci')
    }

   async editVisit(req,res){
        const {name} = req.params;
        const patient = await Patient.findOne({name});
        const szukaj =patient.visitSubsc
        //console.log('a ' + a); [obj, obj]
        const finds = await Patient.findOne({'visitSubsc':{$elemMatch:{name:req.params.nam}}})
        console.log(szukaj.visitdone);
        console.log('find ' + finds);
       // console.log('findai ' + finds.visitSubsc.find(x=>x.visitSubsc[1]));
    
        res.render('pages/admin-panel/patient/patientVisitEdit',{
            name,form:finds
        })
        
    }






}

module.exports = new PatientController();