import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import "vue-multiselect/dist/vue-multiselect.css"
// import clock from 'clock'
import "i3t-vue3/dist/style.css"


const pinia = createPinia()

createApp(App)
.use(pinia)
// .use(clock)
.mount('#app')
