const User = require('../db/models/Users');
const Patient = require('../db/models/Patients');
const Visit = require('../db/models/Visit');
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
        const patients = await query.populate({path: 'connect', model: "User"}).exec(); //DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
        
    
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
            visit:req.body.visit,
            connect:req.session.user._id,
           
        });
        
        try {
            await patient.save();                             
            console.log('zapisano');
            res.redirect('/admin/pacjenci')
        }catch(e){
            console.log('niezapisano');
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
       const patient =  await Patient.findOne({name})
       req.session.patient = patient;  

       const allVisit =  await Visit.find().populate({path: 'visitDate', model: "Patient"}).exec();;
      
        res.render('pages/admin-panel/patient/patientCard',{
            form:image,
            username:user.username,
           
            title:patient?.name,
            name,
            email:patient.email,
            phone:patient.phone,
            address:patient.address,

            allVisit
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
    //     const {name} = req.params;
    //     const patient = await Patient.findOneAndUpdate(
    //         {name},
    //         {$push:{"visitSubsc":req.body} }
    //         );
    //         res.redirect('/admin/pacjenci')
    // }
        let visit = new Visit({
            visitSubsc:req.body.visitSubsc,
            visitTime:req.body.visitdone,
            visitDate:req.session.patient._id                               //tttttttttttt
        });
        try {
            await visit.save();                                                                         
            res.redirect('/admin/pacjenci')
        }catch(e){
            res.render('pages/admin-panel/patient/patientRegistration',{
                errors:e.errors,
                form:req.body,
          
            })}
    }
        

   async editVisit(req,res){
        const {name} = req.params;
        const {visitdone} = req.params 
        const patient = await Patient.findOne({name});
         
        res.render('pages/admin-panel/patient/patientVisitEdit',{
            name, 
            patient,visitdone,
        });
    }

      async  updateVisit(req,res){
            const {name} = req.params;
            const {visitdone} = req.params 
            const patient = await Patient.findOne({name});
            
            //patient.visitSubsc.visitSubsc=req.body.visitSubsc;
            //patient.visitSubsc.visitdone=req.body.visitSubsc;
            
            patient.visitSubsc.forEach((visitSub,index) => {
                if (visitSub.visitSubsc ) { 
                 console.log( visitSub.visitSubsc + index );
                
                 visitSub.visitSubsc=req.body.visitSubsc;
                  }
                  else{console.log('cos nie tak');}    
                })

            try{
                await patient.save();
                console.log('zapisalo');
                res.redirect('/admin/pacjenci')
            } catch(e) {
                console.log('nie zapisalo');
                res.render('pages/editprofile',{
                errors: e.errors})
            }
        }






}

module.exports = new PatientController();

//VISITedit chyba
{/* <form action="" method="post">

<div class="board-container">
    <div class="forms ">
        <button class="button-34" role="button">Edytuj opis wizyty</button>
        <div class="input-field">
            <label for="">Opis wizyty</label>
            
            <label for="">Data odbytej wizyty</label>
                <% patient.visitSubsc.forEach((visitSub) => { %>
                    <% if ( visitSub.visitdone===visitdone) { %>
                <input name="visitSubsc"  type="text" id="visitSubsc" value='<%= visitSub.visitSubsc %>'></input>
                <input name="visitSubsca"  type="text" id="visitSubsca" value='<%= visitSub.visitdone %>'></input>
               
                <%}%> 
                <% }); %>  
            </div>
    </div>
</div>
    

</form>    */}

// CARD
// <div class="options-part">
//                     <div class="history">
//                         <a href="/admin/pacjenci/<%= name %>/wizyta">Dodaj nową wizytę</a>
                        
//                         <% visitSubsc.reverse().forEach (visit => { %>
//                             <a class="history-date" href="/admin/pacjenci/<%= name %>/<%= visit.visitdone %>"><%= visit.visitdone%></a>
                        
//                         <% }) %>
//                     </div>
//                     <div class="history-description">
                        
                        
//                         <% visitSubsc.forEach (visit => { %>
                            
//                             <h2>Opis wizyty z dnia: <%= visit.visitdone%> </h2>
//                         <h4><%= visit.visitSubsc %><hr></h4>
//                         <% }) %>
//                     </div>
//                     </div>