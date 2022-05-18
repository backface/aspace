import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 8000,
    https: false,
    proxy: {
      '/ws': {
         target: 'http://localhost:3000',
         changeOrigin: true,
         secure: false,
         ws: true,
       }
     }
  },

})
