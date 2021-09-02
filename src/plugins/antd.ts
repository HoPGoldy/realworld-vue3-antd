import {
    Button, Card, Layout, Avatar, Typography, Space, Col, Row, List, Tabs,
    Tag, Menu, Form, Select, Input, Alert, Spin, Skeleton
} from 'ant-design-vue';
import { App } from 'vue';

const plugins = [
    Button, Card, Layout, Avatar, Typography, Space, Col, Row, List, Tabs,
    Tag, Menu, Form, Select, Input, Alert, Spin, Skeleton
];

export const useAntd = (app: App) => {
    plugins.forEach(plugin => app.use(plugin));
    return app;
};