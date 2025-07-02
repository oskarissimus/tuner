const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

const server = http.createServer((req, res) => {
    // Parse URL and get file path
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set default MIME type
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File doesn't exist, return 404
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                        h1 { color: #ff6b6b; }
                    </style>
                </head>
                <body>
                    <h1>404 - File Not Found</h1>
                    <p>The requested file could not be found.</p>
                    <a href="/">Go back to Guitar Tuner</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>500 - Server Error</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
                            h1 { color: #ff6b6b; }
                        </style>
                    </head>
                    <body>
                        <h1>500 - Server Error</h1>
                        <p>An error occurred while serving the file.</p>
                        <a href="/">Go back to Guitar Tuner</a>
                    </body>
                    </html>
                `);
                return;
            }
            
            // Set appropriate headers
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            
            res.end(data);
        });
    });
});

server.listen(port, () => {
    console.log(`🎸 Guitar Tuner Pro server running on port ${port}`);
    console.log(`🌐 Access the app at: http://localhost:${port}`);
    console.log(`📱 Make sure to allow microphone access when prompted`);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Try a different port.`);
    } else {
        console.error('❌ Server error:', err);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🔄 Received SIGINT, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});