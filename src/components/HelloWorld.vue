<script setup>
import { ref } from 'vue'

// defineProps({
//   msg: String,
// })

const count = ref(0)
const title = ref("Seats")
const picks = ref(["custom", "predefined"])
const picked = ref(0)
const custom_layouts = ref([
  { name: 'rectangle' },
  { name: 'square' },
  { name: 'circle' },
  { name: 'oval' },
  { name: 'half-rectangle' },
  { name: 'half-square' },
  { name: 'half-circle' },
  { name: 'half-oval' }
])
const selected_layout = ref()
</script>

<template>
  <h1>{{ title }}</h1>
  <h1>{{ picks[picked] }}</h1>

  <div class="card">

    <div style="padding: 10px;">
      <span v-for="(p,index) in picks"> 
        <input type="radio" v-model="picked" :value="index" :id="'seat_style_'+index"/>
        <label :for="'seat_style_'+index">
          {{ p }}
        </label>
      </span>
    </div>

    <div v-if="picked == 0">
      <div>
        No. of rows
        <input type="number" name="rows" id="no_of_rows">
      </div>
      <div>
        No. of seats
        <input type="number" name="seats" id="no_of_seats" placeholder="Type desire seat count">
      </div>
      <div>
        Seat layout {{ selected_layout }}
        <select v-model="selected_layout">
          <option disabled>Choose Layout</option>
          <option v-for="custom_layout in custom_layouts" :value="custom_layout">{{custom_layout.name}}</option>
        </select>
      </div>
    </div>

    <button type="button" @click="count++">count is {{ count }}</button>
  </div>

</template>

<style scoped>
</style>
