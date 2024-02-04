<script setup>
import { ref, onMounted, computed } from 'vue'
import momentTZ from 'moment-timezone'
import VueMultiselect from 'vue-multiselect'

const hours = ref(Array(12).fill().map((ele, index) => ((index + 1) < 10 ? '0' + (index + 1) : (index + 1) )))
const mins = ref(Array(60).fill().map((ele, index) => (index < 10 ? '0' + index : index )))
const time_periods = ref(['AM', 'PM'])

const from_tz = ref(momentTZ.tz.guess())
const from_hour = ref(momentTZ.tz(from_tz.value).format("hh"))
const from_min = ref(momentTZ.tz(from_tz.value).format("mm"))
const selected_time_period = ref(momentTZ.tz(from_tz.value).format("A"))

const to_tzs = ref([])

const tz_names = ref(momentTZ.tz.names())

// const converted_data = defineModel('converted_data')
// 
// converted_data.value = {
//     from_tz: {
//       name: from_tz.value,
//       time: from_hour.value + ":" + from_min.value + " " + selected_time_period.value
//     },
//     to_tzs: to_tzs.value.map(tz => ({name: tz, time: momentTZ.tz(fromUTC, tz).format("h:mm A")}))
//   };


const converted_data = computed(() => {
  let hr = from_hour.value

  if (selected_time_period.value == 'PM' && Number(from_hour.value) < 12) {
    hr = Number(from_hour.value) + 12
  }

  if (selected_time_period.value == 'AM' && Number(from_hour.value) == 12) {
    hr = '00'
  }

  const f_date = momentTZ.tz(from_tz.value).format("YYYY-MM-D") + ' ' + hr + ':' + from_min.value
  const fromUTC = momentTZ.tz(f_date, from_tz.value).utc().format()

  return {
    from_tz: {
      name: from_tz.value,
      time: from_hour.value + ":" + from_min.value + " " + selected_time_period.value
    },
    to_tzs: to_tzs.value.map(tz => ({name: tz, time: momentTZ.tz(fromUTC, tz).format("h:mm A"), diff: momentTZ.tz(f_date, from_tz.value).diff(momentTZ.tz(fromUTC, tz).format("h:mm A"))}))
  }
})

</script>
<template>
  <div style="margin: auto; width: 100%;">
    <h4 style="text-align: center;">Converter</h4>
    <div class="converter-group-wrap" style="">
      <h4 style="margin-bottom: 0;">From</h4>
      <div style="">
        <VueMultiselect v-model="from_tz" :options="tz_names"  placeholder="Select Timezone" :show-labels="false"></VueMultiselect>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 3%; padding: 2% 0; justify-content: center; margin: auto;">
          <VueMultiselect v-model="from_hour" :options="hours"  placeholder="Select Hour" :show-labels="false"></VueMultiselect>
          <VueMultiselect v-model="from_min" :options="mins"  placeholder="Select Mins" :show-labels="false"></VueMultiselect>
          <VueMultiselect v-model="selected_time_period" :options="time_periods"  placeholder="Hour" :show-labels="false"></VueMultiselect>
        </div>
      </div>
    </div>
    <div class="converter-group-wrap" style="margin-top: 1em;">
      <h4 style="margin-bottom: 0;">To</h4>
      <div>
        <VueMultiselect v-model="to_tzs" :options="tz_names" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select Timezone" :show-labels="false"></VueMultiselect>
      </div>
    </div>
    <!-- <slot name="converted-list" :converted_data="converted_tzs"> -->
    <slot name="converted-list" v-bind="converted_data">
      <div class="converted-list" v-if="converted_data.to_tzs.length > 0">
        <ul>
          <li v-for="c in converted_data.to_tzs">{{ c.time }} in {{ c.name }}</li>
        </ul>
      </div>
    </slot>
  </div>
</template>
<style scoped>
input {
  box-sizing: border-box;
  padding: 10px;
}
.converter-group-wrap {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
.converter-input-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10%;
  margin: auto;
}

.converted-list {
  margin: auto;
  margin-top: 2rem;
  background-color: white;
  border-radius: 5px;
  padding: 0.5rem;
}

.converted-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-weight: bolder;
}

.converted-list ul li {
  padding: 0.2rem;
}

@media (prefers-color-scheme: dark) {
  * {
    --bg-color: #222222; /* Dark background */
    --text-color: #77ffff; /* Light text color */
  }
}

@media screen and (max-width: 800px) {
  .converter-input-group {
    /* max-width: 70%; */
    gap: 2%;
  }
}

@media screen and (max-width: 600px) {

}

</style>