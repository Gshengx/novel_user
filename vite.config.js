import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 自动导入vue中hook reactive ref等
import AutoImport from 'unplugin-auto-import/vite'
// antd-vue
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
// 自动导入ui组件
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router']
    }),
    Components({
      resolvers: [VantResolver()]
    })
  ],
  // 别名
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    }
  },
  // 强制预构建插件包
  optimizeDeps: {
    include: ['axios'],
  },
  // 打包配置
  build: {
    target: 'modules',
    outDir: 'dist', //指定输出路径
    assetsDir: 'assets', // 指定生成静态资源的存放路径
    minify: 'terser' // 混淆器，terser构建后文件体积更小
  },
  // 配置前端服务地址和端口
  server: {
    // host: '0.0.0.0',
    port: 8991,
    cors: true,
    open: false,// 在服务器启动时自动在浏览器中打开应用程序
    // https: false,
    //设置反向代理，跨域
    proxy: {
      '/api': {
        //后台地址
        target: 'http://localhost:8081',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/,'')
      }
    }
  }
})
