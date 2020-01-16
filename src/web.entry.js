import './style.scss';
import moment from 'moment-timezone';
moment.tz.setDefault('UTC');

//The javascript map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
//using "map" method to take list of plain events (have only string elements) and convert them to objects having dates as moment ojjects
let events = window.__INITIAL_STATE__.map(event => {
    return {
      description: event.description,
      date: moment(event.date)
    }
});

import VueCalendar from './entry.js';

//setTimeout( function (){
  VueCalendar(events).$mount('#app');
//}, 2000);
