<script setup>
import { ref, computed } from 'vue'

// defineProps({
//   msg: String,
// })

const count = ref(0)
const title = ref("Seating Plan")
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

const predefined_layouts = ref([
  { name: 'bus' },
  { name: 'conference' },
  { name: 'cinema' },
  { name: 'concert' },
  { name: 'stadium' },
])
const selected_layout = ref({})
const selected_affix = ref(0)
const rows = ref(0)
const columns = ref(0)


const layouts = computed(() => {
  return picked.value == 0 ? custom_layouts.value : predefined_layouts.value
})
</script>

<template>
  <h1>{{ title }}</h1>
  <!-- <h1>{{ layouts }}</h1> -->

  <div class="card" style="display: flex; flex-flow: column; gap: 20px; align-items: center; justify-content: center;">

    
    <div style="display: flex; flex-flow: column; gap: 20px; align-items: flex-start;">

      <div style="display: flex; min-width: 100%; text-align: center; align-items: center; justify-content: center;">
        <span v-for="(p,index) in picks"> 
          <input type="radio" v-model="picked" :value="index" :id="'seat_style_'+index"/>
          <label :for="'seat_style_'+index">
            {{ p }}
          </label>
        </span>
      </div>
      
      <div style="display: flex; min-width: 100%; text-align: left; align-items: center;">
        <label style="display: flex; min-width: 55%;">Seat layout</label>
        <select v-model="selected_layout">
          <option disabled>Choose Layout</option>
          <option v-for="layout in layouts" :value="layout">{{ layout.name }}</option>
        </select>
      </div>

      <!-- Total seats -->
      <!-- <div style="display: flex; min-width: 100%; text-align: left; align-items: center;">
        <label for="total_seats" style="display: flex; min-width: 55%;">Total seats</label>
        <input type="number" name="total_seats" id="total_seats" min="1" placeholder="Enter seat count" style="display: flex; min-width: 20%;">
      </div> -->

      <!-- rows -->
      <div style="display: flex; min-width: 100%; text-align: left; align-items: center;">
        <label for="no_of_rows" style="display: flex; min-width: 55%;">No. of rows</label>
        <input style="display: flex; min-width: 20%;" type="number" name="rows" id="no_of_rows" min="1"  placeholder="Enter row count" v-model="rows">
      </div>

      <!-- cols -->
      <div style="display: flex; min-width: 100%; text-align: left; align-items: center;">
        <label for="no_of_cols" style="display: flex; min-width: 55%;">No. of columns</label>
        <input style="display: flex; min-width: 20%;" type="number" name="rows" id="no_of_cols" min="1"  placeholder="Enter col count" v-model="columns">
      </div>

      <!-- Seats per Rows</label -->
      <!-- <div style="display: flex; min-width: 100%; text-align: left; align-items: center;">
        <label for="row_seats" style="display: flex; min-width: 55%;">Seats per Rows</label>
        <input type="number" name="seats" id="row_seats" min="1" placeholder="Enter seat count" style="display: flex; min-width: 20%;">
      </div> -->

      <!-- prefix/suffix -->
      <!-- <div style="margin: 10px;">
        Choose Affix
        <div style="margin: 10px;">
          <input type="radio" id="affix_one" :value="0" v-model="selected_affix" />
          <label for="affix_one">Prefix</label>
  
          <input type="radio" id="affix_two" :value="1" v-model="selected_affix" />
          <label for="affix_two">Suffix</label>
        </div>
      </div> -->
    </div>

    <!-- <div style="margin: 10px;">
      <button type="button" @click="count++">Generate</button>
    </div> -->

    <div>
      <h2>Enter Seats for each Blocks</h2>
      <div v-for="row in rows" :key="row" style="display: flex; gap: 5px; padding: 10px;">
        <div v-for="col in columns" :key="col" style="display: flex; flex-direction: column; border: 2px solid black;">

          <!-- {{ 'Enter Seats for Row ' + row + ' Col ' + col }} -->
          <!-- Seats per cells -->
            <input type="number" name="seats" id="row_seats" min="1" :placeholder="'Seats for Block ' + row + col " style="min-width: 30%;">
        </div>
      </div>
    </div>

    <div>
      <h2>Preview</h2>
      <div v-for="row in rows" :key="row" style="display: flex; gap: 5px; padding: 10px;">
        <div v-for="col in columns" :key="col" style="display: flex; flex-direction: column; border: 2px solid black;">

          <!-- {{ 'Enter Seats for Row ' + row + ' Col ' + col }} -->
          <!-- Seats per cells -->
            <input type="number" name="seats" id="row_seats" min="1" :placeholder="'Seats for Block ' + row + col " style="min-width: 30%;">
        </div>
      </div>
    </div>

  </div>

  <!-- seats -->
  <div>
    
  </div>

</template>

<style scoped>
</style>
