import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from "axios";

const pinia = createPinia()
pinia.use(
  createPersistedState({
    storage: sessionStorage,
  })
)
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('user')? JSON.parse(window.sessionStorage.getItem('user')).token:""
  return config
})
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).use(ElementPlus).use(pinia).mount('#app')