import Vue from 'vue';

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

export default function (events){

    //syntax "Object.assign(target, ...sources)""
    let initialState = Object.assign({}, store.state, { events }); //initialState is an empty object assigned initial state of our vuex store then assigned our events
    store.replaceState(initialState);

    return new Vue({
        data: {
            moment
        },
        components: {
            App
        },
        store,
        render(createElement) {
            //render functoin that defines the virtual dom elements to be rendered
            return createElement(
            'div',
            { attrs: { id: 'app'} },
            [
                createElement('app')
            ]
            );

        }
    });

}