<script setup>
// import HelloWorld from './components/HelloWorld.vue'
// import BusLayoutSVG from './components/BusLayoutSVG.vue'
// import Clock from './components/Clock.vue'
import { ref, computed, markRaw, watch } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { layoutRowStore } from './stores/LayoutRowStore'
import BusLayout from './components/BusLayout.vue'
import Input from './components/Input.vue'
import { Clock, Converter } from 'i3t-vue3';


const rowStore = layoutRowStore()
const rows = ref(0)
const cols = ref(0)
const layout_components = markRaw({
  BusLayout
})
const layouts = ref([
  { name: 'airplane', value: 'PlaneLayout' },
  { name: 'bus', value: 'BusLayout' },
  { name: 'cinema', value: 'CinemaLayout' },
  { name: 'conference', value: 'ConferenceLayout' },
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

const tzs = ref([
    { tz: 'Asia/Tokyo' },
    { tz: null },
    { tz: 'Asia/Bangkok' },
    { tz: 'Asia/Singapore', is_show_num: false },
  ])

const test_inp = ref('')
</script>

<template>
  <div style="display: flex; justify-content: center; gap: 5%;">
    <Clock v-for="t in tzs" :tz="t.tz" :is_show_num="t.is_show_num"/>
  </div>
  <div style="display: flex; justify-content: center; gap: 5%;">
    <Input v-model="test_inp" @input="console.log('input');" @click="console.log('click');" @change="console.log('change');"/>
    {{ test_inp }}
  </div>
  <!-- <div style="display: flex; justify-content: center; margin: auto; width: 50%;">
    <Converter>
      <template #converted-list="converted_data">
        <div>
          {{ converted_data }}
        </div>
      </template>
    </Converter>
  </div> -->
  <div>
    <!-- <div style="display: flex; justify-content: center;">
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
    </div>
    <component v-if="show_template" :is="layout_components[selected_layout.value]"></component> -->
  </div>
</template>

<style scoped>
.select-layout {
  display: flex;
  flex-direction: column;
  /* justify-content: center;
  align-items: center; */
  gap: 20px;
  background-color: white;
  padding: 25px;
  width: 35%;
  margin-top: 1%;
  border-radius: 10px;
}
.form-group {
  /* background-color: rebeccapurple; */
  display: flex;
  width: 100%;
  text-align: left;
  margin: auto;
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
    width: auto;
    margin: auto;
    margin-top: 3%;
  }
  .form-input, .form-label {
    width: 50%;
    /* background-color: #383838; */
  }
}
</style>
