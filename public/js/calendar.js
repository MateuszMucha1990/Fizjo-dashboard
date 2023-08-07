const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay=document.querySelector(".event-day");
const eventDate=document.querySelector(".event-date");
const eventsContainer=document.querySelector(".events");
const addEventSubmit=document.querySelector(".add-event-btn");

let today =new Date();
let activeDay;
let month= today.getMonth()
let year = today.getFullYear();

const months=[
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwieć",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
];

//DODAJ BAZE DANYCH!!!!!!!!!!!!
const eventsArr = [
    {
        day:2,
        month: 8,
        year: 2023,
        events: [
            {
                title:" Andrzej Załucja",
                time:"10:00",
            },
            {
                title:" Michał Załucja",
                time:"11:00",
            },
        ],
    },
    {
        day:14,
        month: 8,
        year: 2023,
        events: [
            {
                title:" koko Załucja",
                time:"10:00",
            },
        ],
    },
]



function initCalendar(){
    const firstDay =new Date(year, month, 1);
    const lastDay =new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0)
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7- lastDay.getDay() - 1;

    date.innerHTML = months[month] + " " + year
    
    let days ="";
    for(let x=day; x>0; x-- ){
        days +=`<div class="day prev-date">${prevDays -x +1}</div>`;
    };

    //current month days
    for (let i=1; i<=lastDate; i++){
        //if event on present day
        let event = false;
        eventsArr.forEach((eve) => {
            if(eve.day === i && eve.month ===month +1 && eve.year ===year){
                event = true
            }
        })

        //if day is today and class today
        if(i === new Date().getDate() && year=== new Date().getFullYear() && month === new Date().getMonth()) {
           activeDay= i;
           getActiveDay(i);
           //updateEvents(i);

         
            //add active on today at startup
            if(event){
            days +=`<div class="day today active event">${i}</div>`;
          } else{
            days +=`<div class="day today active">${i}</div>`;
          }

        }else{
            if(event){
                days +=`<div class="day event">${i}</div>`;
              } else{
                days +=`<div class="day">${i}</div>`;
              }  
        }
    };

    //next month days
    for (let j=1; j<=nextDays; j++){
        days +=`<div class="day next-date">${j}</div>`;  
    };

    daysContainer.innerHTML = days;
    addListener();
}

initCalendar();

//prev month
function prevMonth(){
    month--;
    if(month < 0) {
        month=11;
        year--;
    }
    initCalendar();
};

//next month
function nextMonth(){
    month++;
    if (month > 11) {
        month =0;
        year++
    }
    initCalendar()
};

prev.addEventListener('click',prevMonth);
next.addEventListener('click',nextMonth);


//goto
todayBtn.addEventListener('click',(e) => {
    e.preventDefault();
    fetch("/admin/kalendarz");

    today= new Date();
    month = today.getMonth();
    year=today.getFullYear();
    initCalendar()
});

dateInput.addEventListener('input',(e) => {
   //allows only numbers
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

    if(dateInput.value.length ===2){
        dateInput.value += "/"
    };
    if(dateInput.value.length >7) {
        dateInput.value = dateInput.value.slice(0, 7)
    };
    //if backspace pressed
    if(e.inputType ==="deleteContentBackward"){
        if(dateInput.value.length ===3) {
            dateInput.value = dateInput.value.slice(0, 2)
        };
    };
});


gotoBtn.addEventListener('click' ,(e) => {
    e.preventDefault();
        const dateArr = dateInput.value.split("/");   
        
    if(dateArr.length == 2) {
        if(dateArr[0]>0 && dateArr[0]<13 && dateArr[1].length == 4){
            month = dateArr[0] -1;
            year = dateArr[1];
             initCalendar();
             return
            };
        };
    alert("data nieprawidłowa");
// }
});

// TODO EVENTS!!!

const addEventBtn = document.querySelector('.add-event');
const addEventContainer = document.querySelector('.add-event-wrapper');
const addEventCloseBtn = document.querySelector('.close');
const addEventTitle = document.querySelector('.event_name');
const addEventFrom = document.querySelector('.event_time_from');
const addEventTo = document.querySelector('.event-time-to');

addEventBtn.addEventListener('click',(e) => {
    e.preventDefault();
    addEventContainer.classList.toggle("active")
});

addEventCloseBtn.addEventListener('click',(e) => {
    e.preventDefault();
    addEventContainer.classList.remove("active")
});
//when click outside
document.addEventListener('click', (e)=>{
    if(e.target !== addEventBtn && !addEventContainer.contains(e.target)){
        addEventContainer.classList.remove("active")
    }
});

//max 20 char
addEventTitle.addEventListener('input',(e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 20)
});


addEventFrom.addEventListener('input' ,(e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2){addEventFrom.value += ":"};
    if (addEventFrom.value.length > 5){addEventFrom.value = addEventFrom.value.slice(0, 5)};
});

addEventTo.addEventListener('input' ,(e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2){addEventTo.value += ":"};
    if (addEventTo.value.length > 5){addEventTo.value = addEventTo.value.slice(0, 5)};
});


// ??? listener to days after rendered
function addListener() {
    
    const days = document.querySelectorAll('.day');
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            //current day as active
            activeDay = Number(e.target.innerHTML);
            const sendActiveDay = [activeDay]


            const queryString = Object.keys(sendActiveDay)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(sendActiveDay[key])}`)
            .join('&');
          
            
          fetch(`/admin/kalendarz?${queryString}`)
            .then(response => response.json())
            .then(data => {
              // Handle the response from the Node.js endpoint
              console.log(data); // You should see the appointment that matches the activeDay value
            })
            .catch(error => {
              // Handle any errors that occur during the request
            });

            
            //call active day after click
            getActiveDay(e.target.innerHTML);

           // updateEvents(Number(e.target.innerHTML));
            days.forEach((day) => {
                day.classList.remove('active');
            });

            //if prev month day clicked
            if(e.target.classList.contains("prev-date")) {
                prevMonth();
                setTimeout(() => {
                    const days =document.querySelectorAll('.day');
                    days.forEach((day) => {
                        if (!day.classList.contains('prev-date') &&
                         day.innerHTML=== e.target.innerHTML) {
                            day.classList.add('active');
                         }
                    });
                }, 100);

            }else if(e.target.classList.contains("next-date")) {
                nextMonth();
                setTimeout(() => {
                    const days =document.querySelectorAll('.day');
                    days.forEach((day) => {
                        if (!day.classList.contains('next-date') &&
                         day.innerHTML=== e.target.innerHTML) {
                            day.classList.add('active');
                         }
                    });
                }, 100);

            }else{
                e.target.classList.add('active');
            }
        });
    });
};

//show active day events and date on top

function getActiveDay(date){
    const day = new Date(year,month,date);
    const options = { weekday: 'long', year: 'numeric', month: 'long',day: 'numeric' }; 
    const dayName = day.toLocaleDateString('pl-Pl',options).split(" ")[0];

    eventDay.innerHTML=dayName;
    eventDate.innerHTML = date+ " " + months[month]+ " "+ year;
};



//func to show events of that day
// function updateEvents(date){
//     let events = "";
//     eventsArr.forEach((event) => {
//         //get evennts of active day only
//         if(date== event.day && month +1 == event.month && year== event.year){
//             event.events.forEach((event) => {
//                 events+= `
//                 <div class="event">
//                 <div class="title">
//                     <i class="las la-circle"></i>
//                     <h3 class="event-title">${event.title}</h3>
//                 </div>
//                 <div class="event-time">
//                     <span class="event-time">${event.time}</span>
//                 </div>
//                </div> `
//         });
//     }});

//     //no events
//     if(events =="") {
//         events = `<div class="no-event">
//              <h3>Brak wpisu</h3>
//             </div>`
//     };

//     eventsContainer.innerHTML= events;
// };

//func to add events
addEventSubmit.addEventListener('click', (e) =>{
    e.preventDefault();
    
      
    const eventTitle = addEventTitle.value;
    const evenetTimeFrom = addEventFrom.value;
    const evenetTimeTo = addEventTo.value;

    if(eventTitle ==="" || evenetTimeFrom ==="" || evenetTimeTo === ""){
        alert("Proszę wypełnić wszystkie pola!");
        return; };


    const timeFromArr=evenetTimeFrom.split(":");
    const timeToArr = evenetTimeTo.split(":");
    
    if(timeFromArr.length !== 2 || timeToArr.length !==2
        || timeFromArr[0]>23 || timeFromArr[1]>59
        || timeToArr[0]>23 || timeToArr[1]>59){
            alert("Niepoprawny format ");
        }

        //conv time
    const timeFrom = convertTime(evenetTimeFrom);
    const timeTo = convertTime(evenetTimeTo);


    const newEvent ={
        title: eventTitle,
        time: timeFrom + " - " + timeTo
    };

    let eventAdded = false;
    //if event arr not empty
    if(eventsArr.length>0) {
        eventsArr.forEach((item) => {
            if(item.day === activeDay && item.month === month+1 && item.year== year ){
                item.events.push(newEvent);
                eventAdded = true;
            }
        })
    }

    //if event arr empty or curr day has no event 
    if(!eventAdded ) {
        eventsArr.push({
            day:activeDay,
            month: month +1,
            year: year,
            events:[newEvent]
        });
    };
    const dataToSend = {
        day: activeDay,
        month: month + 1, 
        year: year,
        events: [newEvent]
      };


    //remvoe acrive from add event form
    addEventContainer.classList.remove('active');
    addEventTitle.value="";
    addEventFrom.value="";
    addEventTo.value="";

    //show current added evemt
   // updateEvents(activeDay);

    const activeDayElem = document.querySelector('.day.active');
    if(!activeDayElem.classList.contains('event')){
        activeDayElem.classList.add('event')
    }

    fetch('/admin/kalendarz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      
  
}); 


//remove events  
eventsContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains("event")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;

        //get the title of event than search in array by title and delete
        eventsArr.forEach((event) =>{ 
        if (event.day=== activeDay && event.month=== month+1 && event.year === year){
            event.events.forEach((item,index) => {
                if(item.title === eventTitle) {
                    event.events.splice(index ,1);
                }
            });
            
            if(event.events.length === 0) {
                const activeDayElem = document.querySelector(".day.active");
                if(activeDayElem.classList.contains("event")){
                    activeDayElem.classList.remove("event")
                }
            }
        }
    });
    //after removing from arr update event
    //updateEvents(activeDay)
}
});





function convertTime(time) {
    //convert time to 24 hour format
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
   // let timeFormat = timeHour >= 12 ? "PM" : "AM";
   // timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin ;
    return time;
  };