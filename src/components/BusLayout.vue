<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from 'vue'
import { layoutRowStore } from '../stores/LayoutRowStore'

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
  preview.value[(row * 5) + col].classList.add('bg-red') // 5 is column count
}

const leaveTest = (row, col) => {
  preview.value[(row * 5) + col].classList.remove('bg-red')
}

onBeforeMount(async () => {
  let seat_pos = 0

  for (let i = 0; i < rowStore.rows; i++) {
    seat_pos = (i * 5)
    seats.value.push(getSeats(seat_pos))
  }

})


</script>
<template>
  <div style="display: flex; margin: auto;">
    <div class="input-group">
      <table>
        <tr style="padding: 0; margin: 0;" v-for="row in rowStore.rows">
          <td class="tb-seats" v-for="col in 5" @mouseleave="leaveTest(row - 1 , col - 1)" @mouseover="hoverTest(row - 1, col - 1)">
            <p class="seat-p">
                <span class="editor">
                  <span class="rename-tooltip" v-if="seats[row-1][col-1].is_show_rename">
                    <input type="text" v-model="seats[row-1][col-1].seat_name" @keypress.enter="toggleRenameTooltip(row, col)"  :name="'seat_name_'+ row + '_' + col" :id="'seat_name_'+ row + '_' + col">
                  </span>
                  <span @click="toggleRenameTooltip(row, col)">Rename</span>
                  <span @click="toggleSeatLock(row, col)">Lock</span>
                  <!-- <span>{{seats[row-1][col-1]}}</span> -->
                  <span @click="toggleSeatRemove(row, col)">{{ seats[row-1][col-1].removed ? 'Add seat' : 'Remove'}}</span>
                </span>
            </p>
          </td>
        </tr>
      </table>

    </div>
    <!-- preview -->
    <div class="bus-container">
      <table>
        <tr style="padding: 0; margin: 0;" v-for="row in seats">
          <td ref="preview" class="tb-seats" v-for="col in row" style="width: 20%;">
            <p :class="!col.removed ? 'seat-p' : 'aisle'">
                <span class="seat-sp">{{ col.seat_name }}</span>
            </p>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<style scoped>
.rename-tooltip {
  position: absolute;
  top: -35%;
  left: -10%;
  /* height: 120px; */
  /* width: 100%; */
  /* background-color: #94cdcd; */
  /* padding: 5px; */
  /* border: 1px solid snow; */
  /* border-radius: 10%; */
}

.editor {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: start;
  /* padding: 2px; */
  /* background-color: brown; */
}

.editor span {
  /* width: 100%; */
  /* background-color: aqua; */
  text-align: left;
  margin: 5px;
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
  border: 1px solid black;
}
.seat-sp {
  display: table-cell;
  padding: 10px 5px 10px 5px;
}
.tb-seats {
  text-align: center;
  /* background-color: red; */
  padding: 5px;
}
.bg-red {
  background-color: rebeccapurple;
}
.input-group {
  width: 500px;
  padding: 2px;
  /* overflow: scroll; */
  border: 2px solid purple;
  margin: auto;
  margin-bottom: 10px;
  display: grid;
  gap: 2px;
}
.bus-container {
  width: 500px;
  padding: 2px;
  border: 2px solid purple;
  margin: auto;
  display: grid;
  gap: 2px;
}

.seats-col-grid {
  /* background-color: aqua; */
  height: 50px;
}

.seats-row {
  display: flex;
  width: 100%;
  flex-direction: row;
}

.seats-col {
  width: 20%;
  border: 2px solid greenyellow;
}

.seats-col:nth-of-type(3) {
  border: none
}

/* .seats-col :deep(span) {
  background-color: aqua;
} */

/* .seats-row :deep(.seats-col):empty { */
.seats-col :deep(span):empty {
  background-color: aqua;
  /* display: none; */
}

@media screen and (max-width: 600px) {
  .bus-container {
    width: 90%;
    border: 2px solid skyblue;
    /* background-color: lightblue; */
  }
}

</style>