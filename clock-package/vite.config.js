import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // entry: resolve(__dirname, "src/index.js"),
      // name: 'clock',
      // fileName: (format) => `clock.${format}.js`
      entry: resolve(__dirname, "src/index.js"),
      name: 'i3t-vue3',
      fileName: (format) => `i3t-vue3.${format}.js`
    },
    rollupOptions: {
      external: ["vue", "luxon", "moment-timezone"],
      output: {
        globals: {
          vue: "Vue",
          'moment-timezone': 'momentTZ',
        }
      }
    }
  },
  plugins: [vue()],
})
