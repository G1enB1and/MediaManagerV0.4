import os
import json

def get_directory_structure(directory):
    file_tree = []
    for root, dirs, files in os.walk(directory):
        # Iterate through directories
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            file_tree.append({
                "name": dir_name,
                "type": "directory",
                "path": dir_path,
                "children": get_directory_structure(dir_path)  # Recursively get subdirectories and files
            })
        # Iterate through files
        for file_name in files:
            file_tree.append({
                "name": file_name,
                "type": "file",
                "path": os.path.join(root, file_name)
            })
        return file_tree  # Return after processing this directory

def generate_file_tree():
    directory = 'Pictures'  # Change this to your desired directory
    file_tree = {
        "name": "Pictures",  # Add the root folder
        "type": "directory",
        "path": directory,
        "children": get_directory_structure(directory)  # Recursively get the children
    }
    
    # Write the file tree to a JSON file
    with open('static/file_tree.json', 'w') as f:
        json.dump(file_tree, f, indent=4)

if __name__ == "__main__":
    generate_file_tree()
