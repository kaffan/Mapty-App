'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const form_row = document.querySelectorAll('.form__row');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const mapClicked = document.querySelector('#map');
const clsBtn = document.querySelector('.closebtn');
// Common property declarations
let map;
let commonList=[],commonL;
let type, dist, dur, cad, elev;
let obj;
let marker=[];
let flag=0;

// Workout Class
class Workout
{
    #lat;
    #long;
    #type;
    #distance;
    #duration;
    #cadence;
    #elev_gain;
    #date;
    constructor(lat, long)
    {
        this.#lat = lat;
        this.#long = long;
    }
    set dist(distance)
    {
        this.#distance = distance;
    }
    set typ(type)
    {
        this.#type = type;
    }
    set durr(duration)
    {
        this.#duration = duration;
    }
    set cad(cadence)
    {
        this.#cadence = cadence;
    }
    set Elev(elev)
    {
        this.#elev_gain = elev;
    }
    set date(date)
    {
        this.#date = date;
    }
    get lat()
    {
        return this.#lat;
    }
    get long()
    {
        return this.#long;
    }
    get type()
    {
        return this.#type;
    }
    get cadence()
    {
        return this.#cadence;
    }
    get elev()
    {
        return this.#elev_gain;
    }
    get distance()
    {
        return this.#distance;
    }
    get duration()
    {
        return this.#duration;
    }
    get date()
    {
        return this.#date;
    }
}
// Rendering the stored object
commonL = localStorage.getItem("mainObj") ? JSON.parse(localStorage.getItem("mainObj")) : [];
console.log(commonL);
commonL.forEach((objt,i)=>
{
    obj = new Workout(objt.lat, objt.long);
    obj.dist = objt.dist ? objt.dist : undefined;
    obj.typ = objt.typ ? objt.typ : undefined;
    obj.durr = objt.durr ? objt.durr : undefined;
    obj.cad = objt.cad ? objt.cad : undefined;
    obj.Elev = objt.elev ? objt.elev : undefined;
    obj.date = objt.dat ? objt.dat : undefined;
    commonList.push(obj);
});
commonL=[];
if(commonList.length==0)
{
    getCurrPosition();
}
else
{
    commonList.forEach((objt,i)=>
    {
        if(i==0)
        {
            console.log(objt);
            DisplayMap(objt.lat, objt.long);
            //pointOnMap(objt.lat, objt.long);
            L.marker([objt.lat, objt.long]).addTo(map).bindPopup(L.popup({autoClose: false,
                closeOnClick: false,})).setPopupContent('My Current Location').openPopup();
        }
        else
        {
           // pointOnMap(objt.lat, objt.long);
            let dat = new Date(objt.date);
            newItem(objt.type, objt.distance, objt.duration, objt.cadence, objt.elev, dat);
            L.marker([objt.lat, objt.long]).addTo(map).bindPopup(L.popup({autoClose: false,
                closeOnClick: false,className: `${type}-popup`})).setPopupContent(`${(objt.type=="Running")? "🏃‍♂️": "🚴‍♀️"} ${objt.type} on ${months[dat.getMonth()]} ${dat.getDate()}`).openPopup();

        }
    });
}
// Getting user's location

function getCurrPosition()
{
    if(navigator.geolocation)
    {
        const options = 
        {
            enableHighAccuracy: true,
        };
        navigator.geolocation.getCurrentPosition(function(position,options)
        {
           // console.log(position.coords.latitude,position.coords.longitude);
            pointOnMap(position.coords.latitude,position.coords.longitude);
        });
    }
    else
    {
        alert("Geolocation is not supported by your browser");
    }
}


// Rendering Map on webpage

function pointOnMap(lat, long)
{
    DisplayMap(lat, long);
    L.marker([lat, long]).addTo(map);
    obj = new Workout(lat, long);
    commonList.push(obj);
    console.log(commonList);
}

// Display Map

function DisplayMap(lat, long)
{
    map = L.map('map').setView([lat, long], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
     maxZoom: 30,
     id: 'mapbox/streets-v11',
     tileSize: 512,
     zoomOffset: -1,
     accessToken: 'pk.eyJ1IjoiYWZmYW5rIiwiYSI6ImNreHJub2U4MTIxaGEyb2tvbmJrOGVjOGcifQ.EINQ3wBVPUdttUKE9Yqz_Q'
    }).addTo(map);
}

// Click Callback function

function CallClick(e)
{
    console.log(e);
    e.preventDefault();
    let coords = map.mouseEventToLatLng(e);
    console.log(coords);
    marker = L.marker([coords.lat, coords.lng]).addTo(map);
    // L.marker([coords.lat, coords.long]).addTo(map).bindPopup(L.popup({className: `${type}-popup`})).setPopupContent(`${(objt.type=="Running")? "🏃‍♂️": "🚴‍♀️"} ${objt.type} on ${months[dat.getMonth()]} ${dat.getDate()}`).openPopup();
    // console.log(e.latlng.lat, e.latlng.lng);
    obj = new Workout(coords.lat, coords.lng);
    //console.log(obj);
    createListItem(obj);
    mapClicked.removeEventListener('click',CallClick);
    // commonList.push(obj);
}
// Setting Location on maps

mapClicked.addEventListener('click',CallClick);

// Creating A New List Item
function createListItem(obj)
{
    form.classList.remove('hidden');
}

// adding event to type input
inputType.addEventListener('change', function (e) {
    // e.preventDefault();
   // console.log(1);
    type = inputType.options[inputType.selectedIndex].value;
    if (type === 'Running') {
        form_row[3].classList.toggle('form__row--hidden');
        form_row[4].classList.toggle('form__row--hidden'); 
        cad = inputCadence.value;  
        elev = undefined;                 
    }
    else {
        form_row[4].classList.toggle('form__row--hidden');
        form_row[3].classList.toggle('form__row--hidden');
        elev = inputElevation.value; 
        cad = undefined; 
    }
    inputCadence.value = '';
    inputElevation.value = '';
});

// Adding new item to list (function)

function newItem(type, dist, dur, cad, elev, date)
{
    console.log(typeof date);
    let newListItem = `
            <h2 class="workout__title">${type} on ${months[date.getMonth()]} ${date.getDate()}</h2>
            <div class="workout__details">
              <span class="workout__icon">${(type=="Running")? "🏃‍♂️": "🚴‍♀️"}</span>
              <span class="workout__value">${dist}</span>
              <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${dur}</span>
              <span class="workout__unit">min</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${(type=="Running")? (dur/dist): ((dist*60)/dur)}</span>
              <span class="workout__unit">${type=="Running"? "min/km": "km/h"}</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">${(type=="Running")? "🦶🏼": "⛰"}</span>
              <span class="workout__value">${(type=="Running")? cad: elev}</span>
              <span class="workout__unit">${(type=="Running")? "spm": "m"}</span>
            </div>
          `;
          let newI = document.createElement('li');
          //<li class="workout workout--${type=="Running"? "running": "cycling"}" data-id="1234567890">
          newI.classList.add('workout');
          newI.classList.add(`workout--${type=="Running"? "running": "cycling"}`);
          (type=='Running') ? newI.setAttribute('data-id','1234567890') : newI.setAttribute('data-id','1234567891');
          newI.innerHTML = newListItem;
          containerWorkouts.append(newI);
}
// adding event to document 'Enter' Button
form.addEventListener('keydown',function(e)
    {
        //returnToPreviousPage();
        console.log(!form.classList.contains('hidden'));
        if(e.key=='Enter' && (!form.classList.contains('hidden')))
        {
            console.log(1);
            let date = new Date();
            // e.preventDefault();
            //console.log(e.keycode);
            type = inputType.options[inputType.selectedIndex].value;
            console.log(type);
            dist = inputDistance.value;
            dur = inputDuration.value;
            cad = inputCadence.value;
            elev = inputElevation.value;
            inputDistance.value = '';
            inputDuration.value = '';
            inputCadence.value = '';
            inputElevation.value = '';
            console.log(cad);
            if (type && dist && dur && (cad || elev)) {
                // form.setAttribute('hidden','true');
                obj.typ = type;
                obj.dist = dist;
                obj.durr = dur;
                obj.Elev = elev;
                obj.date = date;
                obj.cad = cad;
                L.marker([obj.lat, obj.long]).addTo(map).bindPopup(L.popup({className: `${type}-popup`})).setPopupContent(`${(obj.type=="Running")? "🏃‍♂️": "🚴‍♀️"} ${obj.type} on ${months[date.getMonth()]} ${date.getDate()}`).openPopup();
                newItem(type, dist, dur, cad, elev, date);
                commonList.push(obj);
                console.log(commonList);
                e.preventDefault();
                form.classList.add('hidden');
                mapClicked.addEventListener('click',CallClick);

            }
            // console.log(JSON.stringify(commonList));
      }
    //   afterItem();
    });

// after adding item

function afterItem()
{
   console.log(commonList);
}

// When closing the document saving object on local storage
//
// solution of problem I was facing: Ya actually I understood the problem

// Here I posted on LinkedIn
// Do check out

// https://www.linkedin.com/posts/affan-khan-6626b9195_programming-javascript-webdeveloper-activity-6884523908486201345-l6tn
function SaveWhenUnloaded()
{
    console.log(commonList);
    // commonL = {...commonList};
    commonList.forEach((obj,i)=>
    {
        console.log(i);
        commonL.push({lat: obj.lat, long: obj.long,typ: obj.type, cad: obj.cadence, elev: obj.elev, dist: obj.distance, durr: obj.duration, dat: obj.date});
    });
    // console.log(JSON.stringify(commonL));
    localStorage.clear();
    localStorage.setItem("mainObj",JSON.stringify(commonL));
}

clsBtn.addEventListener('click',function(e)
{
    setTimeout(()=>
    {
        e.preventDefault();
    localStorage.clear();
    document.querySelector('body').removeAttribute('onbeforeunload');
    window.location.reload();
    },1);
});