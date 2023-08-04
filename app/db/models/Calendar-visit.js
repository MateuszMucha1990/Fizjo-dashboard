const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calendarSchema = new Schema ({
    day:{
        type:Number,
        require
    },
    month:{
        type:Number,
        require
    },
    year:{
        type:Number,
        require
    },
    events: [{
            title:{
                type:String,
                require},
            time:{
                type:String,
                require},
        }
    ]
});

const Calendar_visit = mongoose.model('Calendar_visit',calendarSchema);
module.exports = Calendar_visit;

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
//     eventsArr.save();
