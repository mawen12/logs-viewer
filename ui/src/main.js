import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

/**
 * vuetify
 */
import 'vuetify/styles'
import 'unfonts.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import {createVuetify} from 'vuetify'

import './style.css'

const app = createApp(App)

const vuetify = createVuetify({})

app.use(router)
app.use(vuetify)    

app.mount('#app')
