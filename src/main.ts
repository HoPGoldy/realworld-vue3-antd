import { createApp } from 'vue';
import App from './App.vue';
import router from './plugins/router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// markdown 编辑器
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, { Hljs: hljs });

createApp(App).use(router).use(Antd).use(VMdEditor).mount('#app');
