<script setup>
import { ref, onMounted, computed } from 'vue'

let xPos = 2
let yPos = 10
let p = []
const svgCoor = ref([])
const vpHeight = ref(600)
// [
//   [[x, y], [x, y], [x, y], [x, y]]
// ]

const prepData = () => {
  let row = 5
  for (let i = 0; i < row; i++) { // row
    for (let j = 0; j < 4; j++) { // col
      p.push({ xPos, yPos })
      xPos += 80
    }
    svgCoor.value.push(p)
    p = []
    yPos += 80
    xPos = 2
  }
  vpHeight.value = row * 80
}

const test = (row, col) => {
  console.log(row, col)
}

onMounted(() => {
  prepData()
})

// return x == 2 ? x : (x + 13)
// 2, 15 => 13
// 15, 29 => 14
// 29, 42 => 13
</script>
<template>
  <!-- viewbox ko dynamic lote ya ml -->
  <!-- <div style="width: 100px; height: 120px; overflow: scroll; background-color: gold;"> -->
  <div class="bus-container">
    <svg :viewBox="'0 0 300 ' + vpHeight" xmlns="http://www.w3.org/2000/svg">
      <template v-for="(row, rId) in svgCoor">
        <template v-for="(col, cId) in row">
          <rect :x="col.xPos" :y="col.yPos" @click="test(rId, cId)"/>
        </template>
      </template>
    </svg>
  </div>
  
<!-- 2, 60, 120 , 180 -->



</template>
<style scoped>
.bus-container {
  width: 600px;
  padding: 2px;
  /* height: 600px; */
  border: 2px solid purple;
  margin: auto;
}

@media screen and (max-width: 600px) {
  .bus-container {
    width: 90%;
    height: 90%;
    border: 2px solid skyblue;
    /* background-color: lightblue; */
  }
}

svg {
  width: 100%;
  height: 100%;
  vertical-align: middle;
  /* margin: auto; */
  background-color: aquamarine;
  /* border: 3px solid green; */
}

svg rect {
  fill: #800080;
  width: 50px;
  height: 50px;
}

svg rect:last-child {
  fill: red;
}
.bb {
  fill: gray;
}

#burger_top {
  fill: aqua;
  stroke-width: 500px;
}
</style>