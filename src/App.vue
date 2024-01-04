<script setup>
// import HelloWorld from './components/HelloWorld.vue'
// import BusLayoutSVG from './components/BusLayoutSVG.vue'
// import Clock from './components/Clock.vue'
import { ref, computed, markRaw, watch } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { layoutRowStore } from './stores/LayoutRowStore'
import BusLayout from './components/BusLayout.vue'

const rowStore = layoutRowStore()
const rows = ref(0)
const cols = ref(0)
const layout_components = markRaw({
  BusLayout
})
const layouts = ref([
  { name: 'bus', value: 'BusLayout' },
  { name: 'Conference', value: 'ConferenceLayout' },
  { name: 'cinema', value: 'CinemaLayout' },
  { name: 'concert', value: 'ConcertLayout' },
  { name: 'stadium', value: 'StadiumLayout' },
])
const selected_layout = ref({})

const show_template = ref(false)

watch(selected_layout, async (new_select, old_select) => {
  show_template.value = false
})

const generate = () => {
  if (JSON.stringify(selected_layout.value) === '{}' && rows.value < 1) {
    return
  }
  show_template.value = true
}
</script>

<template>
  <div style="display: grid; place-items: center;">
    <div class="select-layout">
      <div class="form-group">
        <div class="form-label">
          <label>Select Layout</label>
        </div>
        <div class="form-input">
          <VueMultiselect
            v-model="selected_layout"
            deselect-label=""
            track-by="name"
            label="name"
            placeholder=""
            selectLabel=""
            :options="layouts"
            :searchable="false"
            :allow-empty="false">
            <template #option="props">
              <span style="text-transform: capitalize;" class="font-normal text-sm">
                {{
                  `${props.option.name}`
                }}
              </span>
            </template>
          </VueMultiselect>
        </div>
      </div>
      <div class="form-group">
        <div class="form-label">
          <label for="no_of_rows">No. of rows</label>
        </div>
        <div class="form-input">
          <input type="number" name="rows" id="no_of_rows" min="1"  placeholder="" v-model="rowStore.rows">
        </div>
      </div>
      <div class="form-group" v-if="selected_layout.name && selected_layout.name.toLowerCase() !== 'bus'">
        <div class="form-label">
          <label for="no_of_cols">No. of columns</label>
        </div>
        <div class="form-input">
          <input type="number" name="rows" id="no_of_cols" min="1"  placeholder="" v-model="cols">
        </div>
      </div>
      <div class="form-group">
        <button @click="generate()">Generate</button>
      </div>
    </div>
    <component v-if="show_template" :is="layout_components[selected_layout.value]"></component>
    <!-- <Clock /> -->
  </div>
</template>

<style scoped>
.select-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: white;
  padding: 25px;
  width: 50%;
  margin-top: 2%;
  border-radius: 10px;
}
.form-group {
  /* background-color: rebeccapurple; */
  display: flex;
  min-width: 100%;
  text-align: left;
  align-items: center;
}

.form-label {
  display: flex;
  padding: 5px;
  min-width: 55%;
  /* background-color: brown; */
}

.form-input {
  display: flex;
  width: 30%;
}

@media screen and (max-width: 600px) {
  .select-layout {
    width: 90%;
    margin: auto;
    /* border: 2px solid skyblue; */
  }
  .form-input, .form-label {
    width: 50%;
  }
}
</style>
