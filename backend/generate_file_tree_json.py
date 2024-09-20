import os
import json

# Define the Media folder relative to the backend folder
MEDIA_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Media'))

def get_directory_structure(directory):
    file_tree = []
    for root, dirs, files in os.walk(directory):
        # Iterate through directories
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            # Normalize the path to use forward slashes
            dir_path = dir_path.replace('\\', '/')
            file_tree.append({
                "name": dir_name,
                "type": "directory",
                "path": dir_path,
                "children": get_directory_structure(dir_path)  # Recursively get subdirectories and files
            })
        # Iterate through files
        for file_name in files:
            file_path = os.path.join(root, file_name)
            # Normalize the path to use forward slashes
            file_path = file_path.replace('\\', '/')
            file_tree.append({
                "name": file_name,
                "type": "file",
                "path": file_path
            })
        return file_tree  # Return after processing this directory

def generate_file_tree():
    directory = MEDIA_FOLDER  # Updated path to Media folder relative to backend
    file_tree = {
        "name": "Media",  # Add the root folder
        "type": "directory",
        "path": "Media",  # Keep path relative to the Media folder
        "children": get_directory_structure(directory)  # Recursively get the children
    }
    
    # Write the file tree to a JSON file in the static folder
    output_path = os.path.join(os.path.dirname(__file__), '../static/file_tree.json')
    with open(output_path, 'w') as f:
        json.dump(file_tree, f, indent=4)

if __name__ == "__main__":
    generate_file_tree()
