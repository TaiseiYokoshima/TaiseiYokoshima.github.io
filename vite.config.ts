import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import path from "path";
import fs from "fs";

export default defineConfig({
   plugins: [
      react(),
      tailwindcss(),
      {
         name: 'copy-index-to-404',
         closeBundle() {
            const dist = path.resolve(__dirname, 'dist')
            const index = path.join(dist, 'index.html')
            const fallback = path.join(dist, '404.html')
            if (fs.existsSync(index)) {
               fs.copyFileSync(index, fallback)
               console.log('Copied index.html → 404.html for SPA fallback')
            }
         },
      },
   ],
})
