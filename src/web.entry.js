import Vue from 'vue';
import './style.scss';

import store from './store';

import moment from 'moment-timezone';
moment.tz.setDefault('UTC');
Object.defineProperty(Vue.prototype, '$moment', { get() { return this.$root.moment } });

import App from './components/App.vue';

/*
let events = [
  { description: 'Random event 1', date: moment('2020-01-06', 'YYYY-MM-DD') },
  { description: 'Random event 2', date: moment('2020-01-15', 'YYYY-MM-DD') },
  { description: 'Random event 3', date: moment('2020-02-14', 'YYYY-MM-DD') }
];
*/

//The javascript map() method creates a new array populated with the results of calling a provided function on every element in the calling array.
//using "map" method to take list of plain events (have only string elements) and convert them to objects having dates as moment ojjects
let events = window.__INITIAL_STATE__.map(event => {
    return {
      description: event.description,
      date: moment(event.date)
    }
});


//syntax "Object.assign(target, ...sources)""
let initialState = Object.assign({}, store.state, { events }); //initialState is an empty object assigned initial state of our vuex store then assigned our events
console.log("initialState");
console.log(initialState);
store.replaceState(initialState);

new Vue({
  el: '#app',
  data: {
    moment
  },
  components: {
      App
  },
  store
});
