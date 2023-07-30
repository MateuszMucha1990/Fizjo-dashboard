const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");


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
        day:28,
        month: 7,
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
        month: 7,
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
          if(event){
            days +=`<div class="day today event">${i}</div>`;
          } else{
            days +=`<div class="day today">${i}</div>`;
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
const addEventTitle = document.querySelector('.event-name');
const addEventFrom = document.querySelector('.event-time-from');
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
            activeDay = Number(e.target.innerHTML);

            days.forEach((day) => {
                day.classList.remove('active');
            });
        });
    });
}




