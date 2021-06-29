import { Button, Card, Layout, Avatar, Typography, Space, Col, Row, List, Tabs, Tag } from 'ant-design-vue';
import { App } from 'vue';

const plugins = [Button, Card, Layout, Avatar, Typography, Space, Col, Row, List, Tabs, Tag];

export const useAntd = (app: App) => {
    plugins.forEach(plugin => app.use(plugin));
    return app;
};