const allPossibleTimes = [
    '00:00:00','00:30:00','01:00:00','01:30:00','02:00:00','02:30:00','03:00:00',
    '03:30:00','04:00:00','04:30:00','05:00:00','05:30:00','06:00:00','06:30:00',
    '07:00:00','07:30:00','08:00:00','08:30:00','09:00:00','09:30:00','10:00:00',
    '10:30:00','11:00:00','11:30:00','12:00:00','12:30:00','13:00:00','13:30:00',
    '14:00:00','14:30:00','15:00:00','15:30:00','16:00:00','16:30:00','17:00:00',
    '17:30:00','18:00:00','18:30:00','19:00:00','19:30:00','20:00:00','20:30:00',
    '21:00:00','21:30:00','22:00:00','22:30:00','23:00:00','23:30:00'
]

// adds user input date to allPossibleTimes
// to compare reservations and available 
// times on a given day
function addDate(time, date) {
  return date + ' ' + time;
}

// makes allPossibleTimes more readable for options on dropdown menu
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


const dateInput = document.getElementById('date');
const startTime = document.getElementById('start-time');
const endTime = document.getElementById('end-time');
const availableTimesCard = document.getElementById('available-times-card');

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


// changes '04:30:00' to '4:30 am'
function shorterTimes(inputTime) {
    const time = new Date(inputTime);
    let hours;
    const mins = ('0'+ time.getMinutes()).slice(-2).toString()
    if (time.getHours() > 12) {
        hours = time.getHours() - 12;
        return hours.toString() + ':' + mins + ' pm';
    } 
    else if (time.getHours() === 12) {
        hours = time.getHours();
        return hours.toString() + ':' + mins + ' pm';
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
function toNumericDate(wordyString) {
    const wordyDate = new Date(wordyString);
    const year = wordyDate.getFullYear();
    const month = String(wordyDate.getMonth() + 1).padStart(2, "0");
    const day = String(wordyDate.getDate()).padStart(2, "0");
    const hours = String(wordyDate.getHours()).padStart(2, "0");
    const minutes = String(wordyDate.getMinutes()).padStart(2, "0");
    const seconds = String(wordyDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}


const searchButton = document.getElementById('search-date-submit');
searchButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    const selectedDateForm = new FormData(document.getElementById('search-date-form'));
    const chosenDate = dateInput.value;
    const chosenStart = startTime.value;
    let chosenEnd = endTime.value;
    if (!chosenEnd) {
        chosenEnd = '23:59:59';
    }

    const startToSend = new Date(chosenDate + ' ' + chosenStart).toUTCString();
    const endToSend = new Date(chosenDate + ' ' + chosenEnd).toUTCString();
    console.log(chosenDate, startToSend, endToSend);
    if (chosenStart > chosenEnd) {
        alert('Please select a valid time range');
        return;
    }

    // converting to Date before sending to account for time zones
    fetch((`/search/${chosenDate}---${startToSend}---${endToSend}`), {
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
        // takenTimes holds all reservations on a given day in 
        // a 'YYYY-MM-DD HH:MM:SS' format
        let takenTimes = [];
        reservations.forEach(reservation => {
            console.log(reservation.start);
            const reservedTime = new Date(reservation.start);
            console.log(reservedTime);
            const reservedTimeShorter = toNumericDate(reservedTime);
            takenTimes.push(reservedTimeShorter);
            
        })
        
        let selectedTimes = [];
        let startIndex;
        let endIndex;
        let allPossibleTimesWithDate = [];
        
        allPossibleTimes.forEach(time => allPossibleTimesWithDate.push(addDate(time, data.date)))

        // getting all possible times within the optional time range
        if (chosenStart != '00:00:00' && chosenEnd != '23:59:59') {
            // console.log('in if chosenStart and chosenEnd');
            startIndex = allPossibleTimesWithDate.indexOf(chosenDate + ' ' + chosenStart);
            endIndex = allPossibleTimesWithDate.indexOf(chosenDate + ' ' + chosenEnd);
            selectedTimes = allPossibleTimesWithDate.slice(startIndex, endIndex + 1);
        }
        else if (chosenStart) {
            // console.log('in elif chosenStart');
            startIndex = allPossibleTimesWithDate.indexOf(data.start_time.toString());
            selectedTimes = allPossibleTimesWithDate.slice(startIndex);
        }
        else if (chosenEnd  != '23:59:59') {
            // console.log('in elif chosenEnd');
            endIndex = allPossibleTimesWithDate.indexOf(data.end_time.toString());
            selectedTimes = allPossibleTimesWithDate.slice(0, endIndex);
        } else {
            // console.log('in else')
            selectedTimes = allPossibleTimesWithDate.slice();
        }

        // takes all possible times on the given date and filters out the 
        // times that are already reserved
        const availableTimes = selectedTimes.filter(x => !takenTimes.includes(x));
        
        const noTimes = document.getElementById('no-times');
        noTimes.setAttribute('style', 'display:none');

        const timesHeading = document.getElementById('times-heading');
        timesHeading.setAttribute('style', 'display:block');

        if (availableTimes.length === 0) {
            noTimes.setAttribute('style', 'display:block');

            timesHeading.setAttribute('style', 'display:none');
        } 

        const availableTimeDisplay = document.getElementById('available-times');
        availableTimeDisplay.innerHTML = '';
        // creating the buttons for available reservation times
        availableTimes.forEach(time => {
            const timeDisplayButton = document.createElement('div');
            timeDisplayButton.setAttribute('display', 'inline');
            timeDisplayButton.setAttribute('class', 'time-display');

            let finalTime = shorterTimes(time);
            timeDisplayButton.innerHTML = finalTime;
            // adding event listener to book a reservation on click
            timeDisplayButton.addEventListener(('click'), function(evt) {
                const dateTime = new Date(time)
                const url = dateTime.toUTCString();
                console.log(url)
                fetch((`/make-reservation/${url}`), {
                    method: 'POST',
                })
                .then((response) => {
                    return response.json();
                })
                .then((responseJson) => {
                    console.log(responseJson);
                    if (responseJson.success) {
                        timeDisplayButton.remove();
                    }
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
        const reservationDisplayHeading = document.createElement('h3');

        reservationDisplayHeading.innerHTML = `${firstName}'s Reservations`
        reservationDisplay.prepend(reservationDisplayHeading);
        
        let existingReservations = [];

        // sorting user's reservations by date instead of by reservation_id
        data.reservations.sort((a, b) => {
            const dateA = new Date(a.start);
            const dateB = new Date(b.start);
            return dateA - dateB;
        });

        // making user's reservations more readable
        data.reservations.forEach(reservation => {
            const reservationTime = toNumericDate(reservation.start);
            const reservationTimePretty = shorterTimes(reservationTime);
            const reservationTimeNumericDate = new Date(reservationTime);
            const reservationDay = reservationTimeNumericDate.getDate().toString();
            const reservationMonth = (reservationTimeNumericDate.getMonth() + 1).toString();
            const reservationDate = reservationMonth + "/" + reservationDay;

            existingReservations.push(`${reservationDate}: ${reservationTimePretty}`)
        });

        existingReservations.forEach(reservation => {
            const reservationEntry = document.createElement('li');
            reservationEntry.setAttribute('class', 'list-group-item');
            reservationEntry.innerHTML = reservation;

            reservationDisplayList.appendChild(reservationEntry);
        })
        
    })
});
