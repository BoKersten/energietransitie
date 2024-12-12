import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
export default defineConfig({
	plugins: [sveltekit()], // Include the Svelte plugin for Vite
	server: {
		proxy: {
			'/api': {
				target: 'https://api.dataplatform.knmi.nl',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
				configure: (proxy) => {
					proxy.on('proxyReq', (proxyReq, req, res) => {
						// Add the Authorization header for proxied requests
						proxyReq.setHeader(
							'Authorization',
							'eyJvcmciOiI1ZTU1NGUxOTI3NGE5NjAwMDEyYTNlYjEiLCJpZCI6IjU0ZDMzNjg2NTg0YzRjY2E5M2EwNzNiZmZmY2QxMzdmIiwiaCI6Im11cm11cjEyOCJ9'
						);
					});
				}
			}
		}
	}
});
