import Vue from 'vue';

import Vuex from 'vuex';
Vue.use(Vuex);

import moment from 'moment-timezone';
moment.tz.setDefault('UTC');

import Axios from 'axios';

export default new Vuex.Store({
    state: {
        currentYear : 2020,
        currentMonth : 1,
        eventFormPosX : 0,
        eventFormPosY : 0,
        eventFormActive : false,
        events: [
            { description: 'Random event 1', date: moment('2020-01-06', 'YYYY-MM-DD') },
            { description: 'Random event 2', date: moment('2020-01-15', 'YYYY-MM-DD') },
            { description: 'Random event 3', date: moment('2020-02-14', 'YYYY-MM-DD') }
        ],
        eventFormDate: moment()
    },
    mutations: {
        setCurrentMonth(state, payload) {
            state.currentMonth = payload;
        },
        setCurrentYear(state, payload) {
            state.currentYear = payload;
        },
        eventFormPos(state, payload) {
            state.eventFormPosX = payload.x;
            state.eventFormPosY = payload.y;
        },
        eventFormActive(state, payload) {
            state.eventFormActive = payload;
        },
        addEvent(state, payload) {
            state.events.push(payload);
        },
        eventFormDate(state, payload) {
            state.eventFormDate = payload
        },
    },
    actions: {
        //note: "context" object is essentially "the store", it gives us access to commit, dispatch, getters, state
        addEvent(context, payload) {
            return new Promise((resolve, reject) => {
                let obj = {
                    description: payload,
                    date: context.state.eventFormDate
                };
                //ajax request to add event to server
                Axios.post('/add_event', obj).then(response => {
                    if (response.status === 200) {
                        context.commit('addEvent', obj);
                        //resolve if commit is successful (200)
                        resolve();
                    }else{
                        reject();
                    }
                }); 
            });

        }
    }
});
