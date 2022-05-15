import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000,
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
