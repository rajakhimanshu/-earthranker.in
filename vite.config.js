import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: false,
    host: '127.0.0.1', // Forces IPv4 which fixes Edge/Windows WS connection issues
    port: 5173,
    strictPort: true,  // Fails if port is already in use by another 'npm run dev'
    hmr: {
      clientPort: 5173
    }
  },
  // Optimise big deps so Vite doesn't re-bundle them on every page refresh.
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'firebase';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            return 'vendor-others';
          }
        },
      },
    },
    // Increase the warning limit for large chunks
    chunkSizeWarningLimit: 1000,
  },
});
