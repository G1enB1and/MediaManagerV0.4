from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn
from http.server import HTTPServer
import urllib.parse
import json
import os
import logging
import random
from generate_images_json import get_images_from_folders, write_current_images_json

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define the root directory relative to this script file
ROOT_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""
    
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

    def do_POST(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        if path == '/update-images-json':
            self.handle_update_images_json_post()
        else:
            self.send_error(404, 'Endpoint not found')

    def handle_update_images_json_post(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        request_data = json.loads(post_data)

        # Extract the list of folders from the request
        folders = request_data.get('folders', [])

        logging.debug(f"Received folders: {folders}")
        
        # Write the selected folders to current_images.json
        write_current_images_json(folders)

        # Respond with the selected images
        selected_images = get_images_from_folders(folders)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(selected_images).encode('utf-8'))

    def serve_file(self, filename):
        """Serve static files like index.html."""
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
            # Load all_images.json
            all_images_path = os.path.join(ROOT_FOLDER, 'static/all_images.json')
            with open(all_images_path, 'r') as f:
                all_images = json.load(f)

            if folder == "Media":
                # If the folder is the root 'Media', return all images
                filtered_images = [img["path"] for img in all_images]
                logging.debug(f"Returning all images for folder: {folder}")
            else:
                # Log the requested folder
                logging.debug(f"Requested folder: {folder}")

                # Use full folder path comparison to filter images
                filtered_images = [img["path"] for img in all_images if img["folder"] == folder]
                logging.debug(f"Filtered images for folder {folder}: {filtered_images}")

            # Randomize the filtered images
            random.shuffle(filtered_images)

            # Write to current_images.json
            current_images_path = os.path.join(ROOT_FOLDER, 'static/current_images.json')
            with open(current_images_path, 'w') as json_file:
                json.dump(filtered_images, json_file, indent=4)

            # Respond with the randomized images
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(filtered_images).encode('utf-8'))
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

# Start the server
PORT = 8000
server = ThreadingHTTPServer(('localhost', PORT), CustomHandler)
server.timeout = 60  # Increase timeout
print(f"Server running at http://localhost:{PORT}")
server.serve_forever()
