from http.server import SimpleHTTPRequestHandler, HTTPServer
import urllib.parse
import json
import os
import logging

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define the root directory relative to this script file
ROOT_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        logging.debug(f"Received GET on path: {self.path}")
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Managing specific endpoints
        if path == '/':
            # Serve the index.html when the root is accessed
            self.serve_file('index.html')
        elif path == '/update-images-json':
            self.handle_update_images_json(parsed_path.query)
        else:
            # Serve files directly based on their path
            SimpleHTTPRequestHandler.do_GET(self)
    
    def serve_file(self, filename):
        filepath = os.path.join(ROOT_FOLDER, filename)
        if os.path.exists(filepath):
            self.send_response(200)
            self.send_header('Content-type', 'text/html' if filepath.endswith('.html') else 'application/octet-stream')
            self.end_headers()
            with open(filepath, 'rb') as file:
                self.wfile.write(file.read())
        else:
            self.send_error(404, 'File not found')
    
    def handle_update_images_json(self, query):
        query_params = urllib.parse.parse_qs(query)
        folder = query_params.get('folder', [None])[0]
        if folder:
            folder_path = os.path.join(ROOT_FOLDER, folder)
            if os.path.isdir(folder_path):
                media_files = self.scan_folder(folder_path)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(media_files).encode('utf-8'))
            else:
                self.send_error(404, 'Directory not found')
        else:
            self.send_error(400, 'Folder parameter missing')
    
    def scan_folder(self, folder_path):
        supported_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi', '.mkv']
        media_files = []
        for root, _, files in os.walk(folder_path):
            for file in files:
                if any(file.lower().endswith(ext) for ext in supported_extensions):
                    relative_path = os.path.relpath(os.path.join(root, file), ROOT_FOLDER).replace('\\', '/')
                    media_files.append(relative_path)
        return media_files

PORT = 8000
with HTTPServer(('localhost', PORT), CustomHandler) as httpd:
    print(f"Serving on port {PORT}")
    httpd.serve_forever()
