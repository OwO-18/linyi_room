import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 加入下面這段 build 設定
  build: {
    target: 'es2015', // 降低 JS 語法標準，讓舊瀏覽器也能跑
    outDir: 'dist',
  },
  // 如果你有加 base，記得保留
  // base: '/你的repo名稱/', 
})