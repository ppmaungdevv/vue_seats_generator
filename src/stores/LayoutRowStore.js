import { defineStore } from 'pinia'

export const layoutRowStore =  defineStore('rows', {
  state: () => ({rows: 0}),
  actions: {
    increment() {
      this.rows++
    }
  }
})