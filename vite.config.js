import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const config = {
        plugins: [react()],
        build: {
            outDir: 'dist',
            sourcemap: false,
            minify: 'esbuild',
            chunkSizeWarningLimit: 600,
            // Add these for better Vercel compatibility
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                    inlineDynamicImports: false,
                    entryFileNames: '[name]-[hash].js',
                    chunkFileNames: '[name]-[hash].js',
                    assetFileNames: '[name]-[hash].[ext]'
                }
            }
        },
        base: './',
    };
    
    if (mode === 'development') {
        config.server = {
            port: 3000,
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                },
            },
        };
    }
    return config;
});