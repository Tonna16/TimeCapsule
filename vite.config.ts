import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // <- relative paths so assets work regardless of repo path/casing
  plugins: [react()],
  optimizeDeps: { include: ['lucide-react'] },
});
