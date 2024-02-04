<script setup>
import { ref, onMounted, computed } from 'vue'
import momentTZ from 'moment-timezone'

// const props = defineProps(['title', 'tz'])
const props = defineProps({
  tz: {
    type: String,
    default: momentTZ.tz.guess()
  },
  is_show_num: {
    type: Boolean,
    default: true
  }
})
const tz = ref(props.tz ?? momentTZ.tz.guess())
const is_show_num = ref(props.is_show_num ?? true)

const hourDegrees = ref(0)
const minuteDegrees = ref(0)
const secondDegrees = ref(0)

const rotateHands = () => {
  // const now = new Date();
  const now = momentTZ.tz(tz.value);
  // console.log(now);
  // const hour = now.getHours() % 12;
  const hour = now.hour() % 12;
  // const minute = now.getMinutes();
  const minute = now.minutes();
  // const second = now.getSeconds();
  const second = now.seconds();

  hourDegrees.value = (hour * 30) + (0.5 * minute);
  minuteDegrees.value = minute * 6;
  secondDegrees.value = second * 6;
}
// "Asia/Rangoon"
const fromTZ = momentTZ.tz('2024-01-13 13:00', 'Asia/Tokyo')
const fromUTC = momentTZ.tz('2024-01-13 13:00', 'Asia/Tokyo')
const toTZ = momentTZ.tz(fromUTC.utc().format(), 'Asia/Rangoon')

// console.log('JP', fromTZ.hour());
// console.log('JP_UTC', fromUTC.format());
// console.log('MM', toTZ.format());

onMounted(() => {
  rotateHands();
  setInterval(() => (rotateHands()), 1000);
})
</script>
<template>
  <div class="main-wrap" style="">
    <h4 class="tz-label" style="text-align: center;">{{ tz }}</h4>
    <div class="clock">
      <div v-if="is_show_num" class="number" :style="'--n:'+i" v-for="(i, index) in 12" :key="index">
        <p style="margin: 0;">{{ i }}</p>
      </div>

      <div class="hour-hand" :style="'transform: translate(-50%) rotate(' + hourDegrees + 'deg);'"></div>
      <div class="min-hand" :style="'transform: translate(-50%) rotate(' + minuteDegrees + 'deg);'"></div>
      <div class="sec-hand" :style="'transform: translate(-50%) rotate(' + secondDegrees + 'deg);'"></div>

      <div class="center-dot"></div>
    </div>
  </div>
</template>
<style scoped>
.main-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.clock {
  width:  200px;
  height: 200px;
  position: relative;
  background-color: rgb(255, 255, 255);
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
  /* inset: 10px; */
  inset: 3%;
}

.number :deep(p) {
  transform: rotate(calc(-30deg * var(--n)));
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
  /* height: 85px; */
  height: 27%;
  background: linear-gradient(to bottom, #94cdcd, black);
  z-index: 1;
}

.min-hand{
  width: 5px;
  /* height: 120px; */
  height: 35%;
  background: linear-gradient(to bottom, #94cdcd, black);
  z-index: 2;
}

.sec-hand {
  width: 5px;
  /* height: 130px; */
  height: 40%;
  background: linear-gradient(to bottom, #d44b4b, black);
  z-index: 3;
}

@media (prefers-color-scheme: dark) {
  * {
    --bg-color: #222222; /* Dark background */
    --text-color: #77ffff; /* Light text color */
  }

  .tz-label {
    /* color: var(--text-color); */
    color: #94cdcd;
  }

  .clock {
    background-color: #24272d;
    color: var(--text-color);
  }

  .hour-hand {
    background: linear-gradient(to bottom, var(--text-color), black);
  }

  .min-hand {
    background: linear-gradient(to bottom, var(--text-color), black);
  }

  .sec-hand {
    background: linear-gradient(to bottom, #fc4040, black);
  }

}

</style>