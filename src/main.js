import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import "vue-multiselect/dist/vue-multiselect.css"

const pinia = createPinia()

createApp(App).use(pinia).mount('#app')
