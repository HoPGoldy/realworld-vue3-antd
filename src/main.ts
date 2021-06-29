import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import { useAntd } from './plugins/antd';

import mdPlugin from './plugins/markdown';

const { VMdEditor, VMdPreview } = mdPlugin;

const app = createApp(App);
useAntd(app).use(router).use(VMdEditor).use(VMdPreview).mount('#app');
