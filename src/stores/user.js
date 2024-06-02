import { defineStore } from 'pinia'
 export const userStore = defineStore('user', {
  state: () => {
    return { 
      isLogin: false,
      user_id: 0,
      nickname: "",
      email: "",
      icon: "",
      isVIP: false,
      token: ""
    }
  },
  actions: {
    login(id, name, email, icon, isVIP, token) {
      this.isLogin = true
      this.nickname = name
      this.user_id = id
      this.email = email
      this.icon = icon
      this.isVIP = isVIP
      this.token = token
    },
    logout(){
      this.isLogin = false
      this.nickname = ""
      this.user_id = 0
      this.email = ""
      this.icon = ""
      this.isVIP = false
      this.token = ""
    },
    changeName(name){
      this.nickname = name
    },
    changeIcon(icon){
      this.icon = icon
    },
    changeVIP(isVIP){
      this.isVIP = isVIP
    },

  },
  persist: true
 })