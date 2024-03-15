// customHeadersMiddleware.js
export function customHeadersMiddleware() {

    return {
        name: 'custom-headers-middleware',
        apply: 'serve',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
               
                    // Set the desired headers for the specific route(s)
                    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
                    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            
                // Call next middleware in the chain
                next();
            });
        },
    };
}


