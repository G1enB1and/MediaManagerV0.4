import os
import json
import random

# Define the root media folder (up one level from the backend folder)
MEDIA_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Media'))

# Supported file extensions for images, gifs, and videos
SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi', '.mkv']

# Function to scan the media folder and filter out unsupported file types
def scan_folder(folder_path):
    media_files = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            if any(file.lower().endswith(ext) for ext in SUPPORTED_EXTENSIONS):
                # Get the relative path to the media folder, and replace backslashes with forward slashes
                relative_path = os.path.relpath(os.path.join(root, file), MEDIA_FOLDER).replace('\\', '/')
                
                # Include the 'Media/' prefix in the folder path
                folder_relative_path = os.path.relpath(root, MEDIA_FOLDER).replace('\\', '/')
                media_files.append({
                    "path": f"Media/{relative_path}",
                    "folder": f"Media/{folder_relative_path}"  # Add Media/ to the folder path
                })
    return media_files

# New function to get images from multiple folders
def get_images_from_folders(folders):
    selected_images = []
    for folder in folders:
        folder_path = os.path.join(MEDIA_FOLDER, folder)
        selected_images.extend(scan_folder(folder_path))
    random.shuffle(selected_images)  # Randomize the order of images
    return selected_images

# Function to write all images to all_images.json
def write_all_images_json(folder_path=MEDIA_FOLDER):
    media_files = scan_folder(folder_path)
    output_path = os.path.join(os.path.dirname(__file__), '../static/all_images.json')
    
    # Write the media files as JSON
    with open(output_path, 'w') as json_file:
        json.dump(media_files, json_file, indent=4)

# Function to write selected images to current_images.json
def write_current_images_json(selected_folders):
    selected_images = get_images_from_folders(selected_folders)
    output_path = os.path.join(os.path.dirname(__file__), '../static/current_images.json')
    
    with open(output_path, 'w') as json_file:
        json.dump(selected_images, json_file, indent=4)

# Generate the initial all_images.json
if __name__ == "__main__":
    write_all_images_json()
