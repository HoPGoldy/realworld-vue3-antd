import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import styleImport from 'vite-plugin-style-import'
// import analyze from 'rollup-plugin-analyzer'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/realworld-vue3-antd/',
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    plugins: [
        vue(),
        styleImport({
            libs: [
                {
                    libraryName: 'ant-design-vue',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `ant-design-vue/es/${name}/style/index`
                    }
                }
            ]
        })
    ],
    css: {
        preprocessorOptions: {
            less: {
                // modifyVars: {
                //   'primary-color': '#52c41a',
                //   'link-color': '#1DA57A',
                //   'border-radius-base': '2px'
                // },
                javascriptEnabled: true
            }
        }
    },
    build: {
    // rollupOptions: {
    //   plugins: [analyze()],
    // },
    }
})
