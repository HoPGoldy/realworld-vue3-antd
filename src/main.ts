import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import {} from '@/api'

createApp(App).use(router).use(Antd).mount('#app')
