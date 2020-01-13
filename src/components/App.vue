<template>
    <div>
        <div id="header">
            <div>
                <h1>Vue.js Calendar</h1>
            </div>
            <div>
                <current-month></current-month>
            </div>
        </div>
        <div id="day-bar">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
        </div>
        <div id="calendar">
            <div v-for="week in weeks" class="calendar-week">
                <calendar-day  v-for="day in week" :day="day"></calendar-day>
            </div>
        </div>
    </div>
</template>

<script>
    import CalendarDay from './CalendarDay.vue';
    import CurrentMonth from './CurrentMonth.vue';
    export default {
        computed: {
            month() {
                //note: instance of $store is injected into App instance
                return this.$store.state.currentMonth; //changes to the state of store will reactively change the result of this computed property
            },
            year() {
                return this.$store.state.currentYear;
            },
            days() {
                //generating all days in current month
                let days = []; 
                let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D'); //ES6 template literal. A string enclosed by backticks, including ${ } to embed expressions.
                
                console.log(currentDay);
                do {
                    days.push(currentDay);
                    currentDay = this.$moment(currentDay).add(1, 'days'); //if you mutate an object and assign to another variable, it will just be a reference. We need to create a fresh instance of moment!
                } while ((currentDay.month() + 1) === this.month);
                


                //add previous month's days to start
                currentDay = this.$moment(days[0]);
                const SUNDAY = 0;
                const MONDAY = 1;

                if (currentDay.day() !== MONDAY ) {
                    //this month doesnt start on a monday, get days from last month all the way back to last monday!
                    do {
                        currentDay = this.$moment(currentDay).subtract(1, 'days');
                        //days.push(currentDay);
                        days.unshift(currentDay); //pushes to the start of the array! (What a rubbish name for this js function!)
                    } while (currentDay.day() !== MONDAY);  //Note: moment's .day() funciton returns numerical day of week (Eg returns Sunday as 0 )

                }

               
                // Add following days to end
                currentDay = this.$moment(days[days.length - 1]);

                do {
                    currentDay = this.$moment(currentDay).add(1, 'days');
                    days.push(currentDay);
                } while(currentDay.day() !== SUNDAY);

                return days;
            },
            weeks(){
                let weeks = []; //array of weeks
                let week = []; //array of days in a week
                //week = this.days;
                //weeks.push(week);
                //return weeks;

                for (let day of this.days) {
                    week.push(day);
                    if (week.length === 7) {
                        //week now full - add it to weeks array then start a new week
                        weeks.push(week); 
                        week = [];
                    }
                }

                return weeks;

            }
        },
        components: {
            CalendarDay,
            CurrentMonth
        }
    }
</script>