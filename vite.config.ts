import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-framer': ['framer-motion'],
          'vendor-amplify': ['aws-amplify'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Increase warning limit since Amplify is large
    chunkSizeWarningLimit: 600,
  },
});
