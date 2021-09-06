import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import { useAntd } from './plugins/antd';
import { VMdEditor, VMdPreview } from './plugins/markdown';

const app = createApp(App);
useAntd(app).use(router).use(VMdEditor).use(VMdPreview).mount('#app');
