// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { useKakao } from 'vue3-kakao-maps/@utils';

useKakao('acd23fc0b913a085a3ad102649e3b5dc');

const app = createApp(App)

app.use(router)

app.mount('#app')
