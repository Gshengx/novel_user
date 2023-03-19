import { fetchData } from '@/api'
import { createApp } from 'vue'
import './style.css'
import 'vant/es/toast/style';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.globalProperties.fetchData = fetchData;


app.use(router)

app.mount('#app')
