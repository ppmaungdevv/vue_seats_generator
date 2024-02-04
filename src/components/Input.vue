<script setup>
import { ref, onMounted, computed } from 'vue'
const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
})

const model = defineModel({ required: true })
</script>

<template>
  <div>
    <input v-model="model" :type="props.type" name="" id="">
    <span class="error">Error Message</span>
  </div>
</template>

<style scoped>
  .error{
    color: rgb(227, 77, 77)
  }
</style>