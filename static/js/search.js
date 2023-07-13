const allPossibleTimes = [
    '00:00:00','00:30:00','01:00:00','01:30:00','02:00:00','02:30:00','03:00:00',
    '03:30:00','04:00:00','04:30:00','05:00:00','05:30:00','06:00:00','06:30:00',
    '07:00:00','07:30:00','08:00:00','08:30:00','09:00:00','09:30:00','10:00:00',
    '10:30:00','11:00:00','11:30:00','12:00:00','12:30:00','13:00:00','13:30:00',
    '14:00:00','14:30:00','15:00:00','15:30:00','16:00:00','16:30:00','17:00:00',
    '17:30:00','18:00:00','18:30:00','19:00:00','19:30:00','20:00:00','20:30:00',
    '21:00:00','21:30:00','22:00:00','22:30:00','23:00:00','23:30:00'
]

function prettyTimes(time) {
    if (Number(time.slice(0,2)) > 12) {
        const ampmTime = (Number(time.slice(0, 2)) - 12).toString()
        return ampmTime + time.slice(2, 5) + ' pm';
    } else if ((time.slice(0,2) === '00')) {
        const midnightTime = '12';
        return midnightTime + time.slice(2, 5) + ' am';
    } else {
        const finalTime = time.slice(0, 5) + ' am';
        if (finalTime.slice(0,1) === '0') {
            return finalTime.slice(1,5) + ' am';
        }
        return finalTime;
    }
}


const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');
const availableTimesCard = document.getElementById('available-times-card');


function shorterTimes(inputTime) {
    const time = new Date(inputTime);
    let hours;
    const mins = ('0'+ time.getMinutes()).slice(-2).toString()
    if (time.getHours() > 12) {
        hours = time.getHours() - 12;
        return hours.toString() + ':' + mins + ' pm'
    } 
    else if (time.getHours() === 0) {
        hours = time.getHours() + 12;
        return hours.toString() + ':' + mins + ' am'
    } else {
        hours = time.getHours();
        return hours.toString() + ':' + mins + ' am'
    }
}

// changes 'Thu, 27 Jul 2023 20:30:00 GMT' from the database to '2023-07-27 20:30:00'
// function toNumericDate(wordyDate) {
//     const year = wordyDate.getFullYear();
//     const month = String(wordyDate.getMonth() + 1).padStart(2, "0");
//     const day = String(wordyDate.getDate()).padStart(2, "0");
//     const hours = String(wordyDate.getHours()).padStart(2, "0");
//     const minutes = String(wordyDate.getMinutes()).padStart(2, "0");
//     const seconds = String(wordyDate.getSeconds()).padStart(2, "0");

//     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     return formattedDate;
// }


allPossibleTimes.forEach(time => {
    const timeOptionStart = document.createElement('option');
    const timeOptionEnd = document.createElement('option');
    
    let finalTime = prettyTimes(time);
    
    timeOptionStart.setAttribute('value', time);
    timeOptionStart.innerHTML = finalTime;
    startTime.appendChild(timeOptionStart);

    timeOptionEnd.setAttribute('value', time);
    timeOptionEnd.innerHTML = finalTime;
    endTime.appendChild(timeOptionEnd);
    
})


function addDate(time, date) {
  return date + ' ' + time
}


const searchButton = document.getElementById('search-date-submit');
searchButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    const selectedDateForm = new FormData(document.getElementById('search-date-form'));
    fetch(('/search'), {
        method: 'POST',
        body: selectedDateForm
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        availableTimesCard.setAttribute('style', 'display:block')
        const reservations = data.reservations;
        const takenTimes = [];
        
        reservations.forEach(reservation => {
            const reservedTime = new Date(reservation.start);
            console.log(reservedTime);
            // const dateStr = "Thu Jul 27 2023 13:30:00 GMT-0700 (Pacific Daylight Time)";
            // const date = new Date(dateStr);

            // const year = date.getFullYear();
            // const month = String(date.getMonth() + 1).padStart(2, "0");
            // const day = String(date.getDate()).padStart(2, "0");
            // const hours = String(date.getHours()).padStart(2, "0");
            // const minutes = String(date.getMinutes()).padStart(2, "0");
            // const seconds = String(date.getSeconds()).padStart(2, "0");

            // const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            // console.log(formattedDate);

            // formattedDate = toNumericDate(reservedTime);
            // console.log(formattedDate);

            takenTimes.push(reservedTime);
            
        })
        console.log(takenTimes);

        let selectedTimes = [];
        let startIndex;
        let endIndex;
        
        // getting all possible times in the option time range
        if (data.start_time && data.end_time) {

            if (data.start_time > data.end_time) {
                alert('Please select a valid time range');
                return;
            }
            
            startIndex = allPossibleTimes.indexOf(data.start_time.toString());
            endIndex = allPossibleTimes.indexOf(data.end_time.toString());
            selectedTimes = allPossibleTimes.slice(startIndex, endIndex + 1);
        }
        else if (data.start_time) {
            startIndex = allPossibleTimes.indexOf(data.start_time.toString());
            selectedTimes = allPossibleTimes.slice(startIndex);
        }
        else if (data.end_time) {
            endIndex = allPossibleTimes.indexOf(data.end_time.toString());
            selectedTimes = allPossibleTimes.slice(0, endIndex);
        } else {
            selectedTimes = allPossibleTimes.slice();
        }

        selectedTimes = selectedTimes.map(time => data.date + ' ' + time);
        const availableTimes = selectedTimes.filter(x => !takenTimes.includes(x));
        // console.log(availableTimes);

        if (availableTimes.length === 0) {
            const noTimes = document.getElementById('no-times');
            noTimes.setAttribute('display', 'block');
        }

        const timesHeading = document.getElementById('times-heading');
        timesHeading.setAttribute('style', 'display:block');

        const availableTimeDisplay = document.getElementById('available-times');
        availableTimes.forEach(time => {
            console.log(time);
            const timeDisplayButton = document.createElement('div');
            timeDisplayButton.setAttribute('display', 'inline');
            timeDisplayButton.setAttribute('class', 'time-display');

            let finalTime = shorterTimes(time);
            // console.log(finalTime);
            timeDisplayButton.innerHTML = finalTime;
            timeDisplayButton.addEventListener(('click'), function(evt) {
                const url = time.toString();
                fetch((`/make-reservation/${url}`), {
                    method: 'POST',
                })
                .then((response) => {
                    return response.json();
                })
                .then((responseJson) => {
                    console.log(responseJson);
                })
            })
            
            availableTimeDisplay.appendChild(timeDisplayButton);
        
            if (startIndex > endIndex) {
                timesHeading.setAttribute('style', 'display:none');
            }
        })
    })

})


addEventListener("DOMContentLoaded", (event) => {
    fetch('/user')
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data);
        const userGreeting = document.getElementById('user-greeting');
        const firstName = data.first_name;
        userGreeting.innerHTML = `Hi, ${firstName}`;

        const reservationDisplay = document.getElementById('reservation-display');
        const reservationDisplayList = document.getElementById('reservation-display-list');
        // console.log(data.reservations)
        const reservationDisplayHeading = document.createElement('h3');
        reservationDisplayHeading.innerHTML = `${firstName}'s Reservations`
        reservationDisplay.prepend(reservationDisplayHeading);
        
        data.reservations.forEach(reservation => {
            console.log(reservation);
            const reservationTime = new Date(reservation.start);
            // const reservationHour = reservationTime.getHours();
            // console.log(reservationHour);
            
            // const reservationMinutes = reservationTime.getMinutes();
            // console.log(reservationMinutes);

            // const reservationTimeNumeric = toNumericDate(reservationTime).toString();
            // console.log(reservationTimeNumeric);
            const reservationTimePretty = shorterTimes(reservationTime);
            const reservationTimeNumericDate = new Date(reservationTime);
            const reservationDay = reservationTimeNumericDate.getDate().toString();
            const reservationMonth = (reservationTimeNumericDate.getMonth() + 1).toString();
            const reservationDate = reservationMonth + "/" + reservationDay;

            const reservationEntry = document.createElement('li');
            reservationEntry.innerHTML = `${reservationDate}: ${reservationTimePretty}`;

            
            reservationDisplayList.appendChild(reservationEntry);
        })
    })
});


