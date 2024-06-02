import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
<<<<<<< HEAD
import Splitter from 'vue-devui/splitter'
import 'vue-devui/splitter/style.css'
=======
import axios from "axios";

>>>>>>> origin/ly

axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
    .use(ElementPlus)
    .use(Splitter)
    .mount('#app')
