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
        const userId=user._id

        const { q, sort } = req.query 
        const page =req.query.page || 1;
        const perPage= 3;

        //search
        let query = Patient.find({'connect': userId});
        if(q) { query = query.where('name', new RegExp(q, 'i'))};

        //sort
        if(sort) {
            const [sortField, sortOrder] = sort.split('|');
            query = query.sort({ [sortField]: sortOrder});
        }
        
        //pagination
        const paginatePatients = async (page, limit,userId) => {
            const options = {
              page: page,
              limit: perPage,
              populate:'connect',
              lean:true
            };

            try{
                const result = await Patient.paginate(query, options,query);
                return result;
            } catch(error){
                console.log('niedziala paginacja'); } };

        try {
            const patients = await paginatePatients(page, perPage,userId); 
            res.render('pages/admin-panel/patientlist', {
                    form:image,
                    username:user.username,
                    patients,
                    title:patients.name,
                    page,q,
                    totalDocs:patients.totalDocs });
        } catch (error) {
            console.error(error);}
};
         


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
            req.session.patient=patient                         
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
       const patient =  await Patient.findOne({name});
       const allVisit =  await Visit.find().populate({path: 'visitDate', model: "Patient"}).exec();
   
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
    };


    async patientVisit(req,res) {
        const {name} = req.params;
        const patient = await Patient.findOne({name});

        res.render('pages/admin-panel/patient/patientVisit',{
            name,
        });
    };

    async newVisit (req, res) {
        const {name} = req.params;
        const patient = await Patient.findOne({name});
        req.session.patient=patient 
    
        let visit = new Visit({
            visitSubsc:req.body.visitSubsc,
            visitTime:req.body.visitdone,
            visitDate:req.session.patient._id                               
        });
        try {
            await visit.save();                                                                         
            res.redirect('/admin/pacjenci')
        }catch(e){
            res.render('pages/admin-panel/patient/patientRegistration',{
                errors:e.errors,
                form:req.body,
            })}
    };
        

   async editVisit(req,res){
    const {name} = req.params;
        const patient = await Patient.findOne({name:req.params.name});
        const visit = await Visit.findOne({_id:req.params._id});
        res.render('pages/admin-panel/patient/patientVisitEdit',{
            form:visit,
            name,visit
        });
    }

    async  updateVisit(req,res){
        const patient = await Patient.findOne({name:req.params.name});
        const visit = await Visit.findOne({_id:req.params._id});

            visit.visitSubsc=req.body.visitDesc;
            visit.visitTime=req.body.visitdone;
         
        try{
            await visit.save();
            res.redirect('/admin/pacjenci');
            console.log('zapisano');
        } catch(e) {
            res.render('pages/editprofile',{
            errors: e.errors});
            }
        }

      async deleteVisit(req,res) {
          try {
                await Visit.deleteOne({_id:req.params._id});
                res.redirect('/admin/pacjenci');
                console.log('udalo sie');
            } catch (e) {
                errors: e.errors
                console.log('nieusunelo');
            }
        }


}

module.exports = new PatientController();

// <% userArray.forEach(users => { %>
//     <% if (users.connect.username == user.username) {%>
//         <tbody>
//     <tr>
//         <td class="people">
//             <div class="people-desc">
//                 <h3><%= users.name %></h3>
//                 <p class="people_email"><%= users.email %></p>
//             </div>
//         </td>

//         <td class="people_psl">
//             <h4><%= users.pesel %></h4>
//         </td>
//         <td class="people_numb">
//             <h4><%= users.phone %></h4>
//         </td>
//         <td class="people_visit">
//             <h4><%= users.visit %></h4>
//         </td>

//         <td class="people_edit">
//             <a href="/admin/pacjenci/<%= users.name %>/karta">Karta Pacjenta</a>
//         </td>
//     </tr>
// </tbody>
//     <% } %>
//     <% }); %>



// <% if (patients.length === 0) { %>
//     <p>No patients found.</p>
// <% } else { %>
//     <% let matchingPatients = patients.filter(patient => patient.connect.username === user.username); %>
//     <!-- filter patients array to get only the matching patients --> 
//     <% if (matchingPatients.length > 0) { %> <!-- check if there are any matching patients -->
      
//         <% matchingPatients.forEach(patient => { %> <!-- loop over matching patients array -->
//             <tbody>
//                 <tr>
//                     <td class="people">
//                         <div class="people-desc">
//                             <h3><%= patient.name %></h3>
//                             <p class="people_email"><%= patient.email %></p>
//                         </div>
//                     </td>
//                     <td class="people_psl">
//                         <h4><%= patient.pesel %></h4>
//                     </td>
//                     <td class="people_numb">
//                         <h4><%= patient.phone %></h4>
//                     </td>
//                     <td class="people_visit">
//                         <h4><%= patient.visit %></h4>
//                     </td>
//                     <td class="people_edit">
//                         <a href="/admin/pacjenci/<%= patient.name %>/karta">Karta Pacjenta</a>
//                     </td>
//                 </tr>
//             </tbody>
//         <% }); %>

//         <% } else { %>
//             <p>No matching patients found.</p>
//             <% } %>
//             <% } %>