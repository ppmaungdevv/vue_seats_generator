<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const hourDegrees = ref(0)
const minuteDegrees = ref(0)
const secondDegrees = ref(0)

const rotateHands = () => {
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();

  hourDegrees.value = (hour * 30) + (0.5 * minute);
  minuteDegrees.value = minute * 6;
  secondDegrees.value = second * 6;
}

onMounted(() => {
  rotateHands();
  setInterval(() => (rotateHands()), 1000);
})
</script>
<template>
  <div>
    <h4>clock</h4>
    <!-- <div style="display: flex; justify-content: center; align-items: center; height: 300px; box-sizing: border-box; margin: 0; padding: 0; background-color: #94cdcd;"> -->
      <div class="clock">
        <div class="number" :style="'--n:'+i" v-for="(i, index) in 12" :key="index">
          {{ i }}
        </div>

        <div class="hour-hand" :style="'transform: translate(-50%) rotate(' + hourDegrees + 'deg);'"></div>
        <div class="min-hand" :style="'transform: translate(-50%) rotate(' + minuteDegrees + 'deg);'"></div>
        <div class="sec-hand" :style="'transform: translate(-50%) rotate(' + secondDegrees + 'deg);'"></div>

        <div class="center-dot"></div>
      </div>
    <!-- </div> -->
  </div>
</template>
<style scoped>
.clock {
  width: 300px;
  height: 300px;
  position: relative;
  background-color: aliceblue;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #94cdcd;
}

.number {
  transform: rotate(calc(30deg * var(--n)));
  position: absolute;
  text-align: center;
  inset: 10px;
}

.center-dot {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: black;
  z-index: 4;
}

.hour-hand, .min-hand, .sec-hand {
  position: absolute;
  left: 50%;
  bottom: 50%;
  transform-origin: bottom;
  border-radius: 50px;
}

.hour-hand{
  width: 5px;
  height: 85px;
  background: linear-gradient(to bottom, #94cdcd, black);
  z-index: 1;
}

.min-hand{
  width: 5px;
  height: 120px;
  background: linear-gradient(to bottom, #94cdcd, black);
  z-index: 2;
}

.sec-hand {
  width: 5px;
  height: 130px;
  background: linear-gradient(to bottom, #d44b4b, black);
  z-index: 3;
}

</style>