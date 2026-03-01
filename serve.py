#!/usr/bin/env python3
"""
Local development server with custom 404 handling.
Usage: python3 serve.py [port]
Default port: 8000
"""

import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


class Custom404Handler(SimpleHTTPRequestHandler):
    """HTTP request handler that serves custom 404.html for unknown routes."""
    
    def send_error(self, code, message=None, explain=None):
        """Override to serve custom 404.html instead of default error page."""
        if code == 404:
            try:
                # Try to serve custom 404.html
                custom_404_path = Path('404.html')
                if custom_404_path.exists():
                    self.send_response(404)
                    self.send_header('Content-type', 'text/html; charset=utf-8')
                    self.end_headers()
                    
                    with open(custom_404_path, 'rb') as f:
                        self.wfile.write(f.read())
                    return
            except Exception as e:
                print(f"Error serving custom 404: {e}", file=sys.stderr)
        
        # Fallback to default error handling
        super().send_error(code, message, explain)
    
    def end_headers(self):
        """Add CORS headers for local development."""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()


def run_server(port=8000):
    """Start the development server."""
    server_address = ('', port)
    httpd = HTTPServer(server_address, Custom404Handler)
    
    print(f"🚀 Local development server running at:")
    print(f"   http://localhost:{port}")
    print(f"   Custom 404 page enabled: 404.html")
    print(f"\n   Press Ctrl+C to stop\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✨ Server stopped")
        sys.exit(0)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port)
