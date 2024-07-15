import { defineStore } from 'pinia'
 export const mindStore = defineStore('mindmap', {
  state: () => {
    return { 
      data: [{"name": "test"}]
    }
  },
  actions: {
    changeData(data){
      this.data = data
    },

  },
  persist: true
 })