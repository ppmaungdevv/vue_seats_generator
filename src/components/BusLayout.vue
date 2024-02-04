<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue'
import { layoutRowStore } from '../stores/LayoutRowStore'
import { Icon } from '@iconify/vue';

const rowStore = layoutRowStore()


const props = defineProps(['foo'])
const getGridTemplateColumns = (row) => {
  let gtc = ['auto', 'auto', '20%', 'auto', 'auto'];
  if (row.slice(0, 2).some(ele => JSON.stringify(ele) == '{}')) {
    gtc.shift()
    gtc[0] = '35%'
    gtc[1] = '22%'
  }
  
  if (row.slice(3).some(ele => JSON.stringify(ele) == '{}')) {
    gtc.pop()
    if (row.slice(0, 2).some(ele => JSON.stringify(ele) == '{}')) {
      gtc[1] = 'auto'
    } else {
      gtc[1] = '22%'
    }
    gtc[gtc.length - 1] = '35%'
  }

  return 'grid-template-columns: ' + gtc.join(' ') + ';'
}

const total_row = ref(0);
const seats = ref([]);


// 1. Confirmed: When the ticket has been booked and the seat is confirmed.
// 2. Waitlisted: When the ticket is on a waiting list and the availability of the seat is not confirmed.
// 3. Cancelled: When the ticket has been cancelled by the passenger or the bus company.
// 4. Rescheduled: When the departure time or date of the bus has been changed.
// 5. No show: When the passenger fails to board the bus without cancelling the ticket.


const seat_status = ['locked', 'available','waitlisted', 'confirmed', 'cancelled', 'noshow']
const getSeats = (seat_pos) => {
  return [ ...Array(5) ].map((ele, index) => ({
    seat_name: seat_pos + (index + 1),
    locked: false,
    status: seat_status[1],
    is_show_rename: false,
    removed: false
  }))
}

watch(() => rowStore.rows, async (new_total_row, old_total_row) => {
  // setting initial seats
  let seat_pos = 0
  if (old_total_row == 0 && new_total_row > 0) {
    for (let i = 0; i < new_total_row; i++) {
      seat_pos = (i * 5)
      seats.value.push(getSeats(seat_pos))
    }
  }

  // pushing more seats to initial seats
  if (old_total_row != 0 && new_total_row > 0 && new_total_row > old_total_row) {
    for (let i = old_total_row; i < new_total_row; i++) {
      seat_pos = (i * 5)
      seats.value.push(getSeats(seat_pos))
    }
  }

  // removing seats
  if (new_total_row < old_total_row) {
    seats.value.splice(-(old_total_row - new_total_row))
  }

})

const toggleSeatRemove = (row, col) => {
  if (seats.value[row-1][col-1].removed) {
    // add
    seats.value[row-1][col-1].seat_name = ((row - 1) * 5) + (col)
    seats.value[row-1][col-1].removed = false
  } else {
    // remove seat
    seats.value[row-1][col-1].seat_name = null
    seats.value[row-1][col-1].removed = true
  }
}

const toggleSeatLock = (row, col) => {
  if (seats.value[row-1][col-1].status == 'locked') {
    // unlocking
    seats.value[row-1][col-1].status = 'available'
  } else {
    // locking
    seats.value[row-1][col-1].status = 'locked'
  }
}

const toggleRenameTooltip = (row, col) => {
  seats.value[row-1][col-1].is_show_rename = !seats.value[row-1][col-1].is_show_rename
}

const preview = ref(null)

const hoverTest = (row, col) => {
  preview.value[(row * 5) + col].style.color = 'white'
  // preview.value[(row * 5) + col].style.backgroundColor = '#94cdcd'
  preview.value[(row * 5) + col].style.backgroundColor = '#023c39'
  preview.value[(row * 5) + col].style.transform = 'scale(1.3)'
  // console.log(preview.value[(row * 5) + col].style)
  // preview.value[(row * 5) + col].classList.add('hover-color') // 5 is column count
}

const leaveTest = (row, col) => {
  preview.value[(row * 5) + col].style.backgroundColor = 'white'
  preview.value[(row * 5) + col].style.color = 'black'
  preview.value[(row * 5) + col].style.transform = ''
  // preview.value[(row * 5) + col].classList.remove('hover-color')
}

onBeforeMount(async () => {
  let seat_pos = 0

  for (let i = 0; i < rowStore.rows; i++) {
    seat_pos = (i * 5)
    seats.value.push(getSeats(seat_pos))
  }

})

const t = () => {
  console.log(seats.value[0][0]);
}

</script>
<template>
  <div class="wrap" style="">

    <div class="editor-layout-wrapper" style="">
      <!-- <table style="background-color: whitesmoke; border-radius: 10px;"> -->
      <table style="">
        <tr v-for="row in rowStore.rows">
          <td v-for="col in 5" style="text-align: center;" @mouseleave="leaveTest(row - 1 , col - 1)" @mouseover="hoverTest(row - 1, col - 1)">
            <!-- <div class="tb-td" style="display: flex; flex-direction: column; width: 100%;"> -->
            <!-- <div class="tb-td" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; width: 100%; place-items: center;"> -->
              
              <!-- <Icon icon="fa-solid:edit" style=" font-weight: bolder; color: #43b0b0;" />
              <Icon icon="uis:lock" style=" font-weight: bolder; color: #023c39;" />
              <Icon icon="mingcute:delete-fill" style=" font-weight: bolder; color: #dc3838;" /> -->
            <!-- </div> -->
            <!-- <div style="display: flex; align-items: center; justify-content: space-around;"> -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(30px, 1fr)); gap: 1rem; place-items: center;">
              <Icon icon="fa-solid:edit" style="font-size: 1.5rem; font-weight: bolder; color: #43b0b0;" />
              <Icon icon="uis:lock" style="font-size: 1.5rem; font-weight: bolder; color: #023c39;" />
              <Icon icon="mingcute:delete-fill" style="font-size: 1.5rem; font-weight: bolder; color: #dc3838;" />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="preview-wrapper" style="">
      <!-- <table style="background-color: whitesmoke; border-radius: 10px;"> -->
      <table style="">
        <tr v-for="row in seats">
          <td ref="preview" class="" v-for="col in row" style="transition: transform .2s;">
            <span style="">{{ 'VIP_' + col.seat_name }}</span>
          </td>
        </tr>
      </table>
    </div>

  </div>
  <!-- <button @click="t()">click</button> -->
  <!-- <div class="input-group">
    <table style="background-color: red; margin: auto;">
      <tr style="padding: 0; margin: 0;" v-for="row in rowStore.rows">
        <td class="tb-seats" v-for="col in 5" @mouseleave="leaveTest(row - 1 , col - 1)" @mouseover="hoverTest(row - 1, col - 1)">
          <div class="seat-p">
              <span class="editor">
                <span class="rename-tooltip" v-if="seats[row-1][col-1].is_show_rename">
                  <input type="text" v-model="seats[row-1][col-1].seat_name" @keypress.enter="toggleRenameTooltip(row, col)"  :name="'seat_name_'+ row + '_' + col" :id="'seat_name_'+ row + '_' + col">
                </span>
                <div style="display: flex; flex-wrap: wrap;">
                  <span @click="toggleRenameTooltip(row, col)">Rename</span>
                  <span @click="toggleSeatLock(row, col)">Lock</span>
                  <span @click="toggleSeatRemove(row, col)">{{ seats[row-1][col-1].removed ? 'Add seat' : 'Remove'}}</span>
                </div>
              </span>
            </div>
        </td>
      </tr>
    </table>
  </div> -->
  <!-- preview -->
  <!-- <div class="bus-container">
    <table style="margin: auto; width: 100%;">
      <tr style="padding: 0; margin: 0;" v-for="row in seats">
        <td ref="preview" class="tb-seats" v-for="col in row" style="width: 20%;">
          <p :class="!col.removed ? 'seat-p' : 'aisle'">
              <span class="seat-sp">{{ col.seat_name }}</span>
          </p>
        </td>
      </tr>
    </table>
  </div> -->
</template>
<style scoped>
.wrap {
  /* width: 70%; */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  /* background-color: white; */
  padding: 1rem;
  margin-inline: auto;
  margin-top: 2%;
  border-radius: 10px;
  gap: 1rem;
}

.editor-layout-wrapper, .preview-wrapper {
  height: 100%;
  background-color: white;
  border-radius: 7px;
}

.editor-layout-wrapper {
  /* border: 1px solid black; */
  /* border-radius: 7px; */
  /* background-color: red; */
}
.preview-wrapper {
  /* background-color: aquamarine; */
}

.editor-layout-wrapper table, .preview-wrapper table {
  width: 100%;
  border-collapse: separate;
  /* border-spacing: 10px; */
  border-spacing: 1rem;
  margin: auto;
  /* background-color: blue; */
}

.preview-wrapper table {
  /* width: 100%; */
  /* background-color: blue; */
  /* border-collapse: separate;
  border-spacing: 10px; */
  /* border: 1px solid green; */
  text-align: center;
}

.editor-layout-wrapper table td, .preview-wrapper table td {
  word-wrap: break-word;
  padding: 1rem;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
}

@media screen and (max-width: 1024px) {
  .wrap {
    width: auto;
  }
}

@media screen and (max-width: 800px) {
  .wrap{
    /* grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 4%;
    padding: 10px; */
  }
  .preview-wrapper {
    width: auto;
    height: auto;
  }

  .bus-container {
    border: 2px solid skyblue;
    /* background-color: lightblue; */
  }

}

@media screen and (max-width: 500px) {
  .wrap {
    /* overflow-x: scroll; */
  }
  .preview-wrapper, .editor-layout-wrapper {
    /* padding: 0; */
    /* overflow: scroll; */
  }
  .editor-layout-wrapper table {
    /* background-color: sienna; */
    border-spacing: 0px;
  }
  .preview-wrapper table {
    /* border-spacing: 5px; */
  }
}


.wrapper {
  padding: 5%;
  display: flex;
  flex: auto;
  justify-content: center;
  gap: 20%;
  margin: auto;
  background-color: aqua;
}
.input-group {
  /* min-width: 45%; */
  /* max-width: 100%; */
  padding: 1%;
  border: 2px solid gainsboro;
  /* margin: auto; */
  /* display: flex; */
  background-color: black;
}

.bus-container {
  border: 2px solid gainsboro;
  /* margin: auto; */
  /* display: flex; */
  background-color: red;
  /* width: 50%; */
  /* min-width: 25%; */
  /* padding: 2%; */
}
.tb-seats {
  text-align: center;
  padding: 1%;
  /* padding: 5px; */
}

.rename-tooltip {
  position: absolute;
  top: -35%;
  left: -10%;
}

.editor {
  /* display: block; */
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: start;
  /* background-color: brown; */
}

.editor span {
  text-align: left;
  margin: 2%;
  /* margin: 5px; */
}

.editor span:hover {
  cursor: pointer;
}
.seat-p, .aisle {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0;
  margin: 0;
}

.seat-p {
  background-color: aliceblue;
  border: 1px solid gainsboro;
  padding: 10%;
  border-radius: 5%;
}
.seat-sp {
  display: table-cell;
  padding: 10px 5px 10px 5px;
}
.hover-color {
  background-color: rebeccapurple;
}

</style>