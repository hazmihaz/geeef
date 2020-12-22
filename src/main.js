import { createApp } from 'vue'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import 'modern-css-reset'
import App from './App.vue'

createApp(App).mount('#app')
defineCustomElements(window)
