let showFoldersOnly = false;  // Track if only folders should be shown

function toggleFolder(icon) {
    const parentLi = icon.closest('li');
    const subList = parentLi.querySelector('ul');
    const isExpanded = parentLi.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
        subList.style.display = 'none';
        icon.className = 'fa-regular fa-folder';  // Change to closed folder icon
        parentLi.setAttribute('data-expanded', 'false');
    } else {
        subList.style.display = 'block';
        icon.className = 'fa-regular fa-folder-open';  // Change to open folder icon
        parentLi.setAttribute('data-expanded', 'true');
    }
}

export function toggleFilesOption() {
    showFoldersOnly = !showFoldersOnly;

    // Update the dropdown text
    const toggleFilesOptionText = document.getElementById('toggleFilesOption');
    toggleFilesOptionText.textContent = showFoldersOnly ? 'Show Files' : 'Folders Only';

    // Rebuild the file tree with the updated setting
    populateFileTree();
}

export function populateFileTree() {
    const fileTreeContainer = document.getElementById('fileTree');

    // Show a loading indicator while fetching the file tree
    fileTreeContainer.innerHTML = '<li>Loading...</li>';

    // Fetch the file tree from file_tree.json
    fetch('/static/file_tree.json')
        .then(response => response.json())
        .then(data => {
            fileTreeContainer.innerHTML = '';  // Clear the loading message

            // Build the file tree starting from the root
            buildFileTree(fileTreeContainer, [data], 0, true);
        })
        .catch(error => {
            console.error('Error fetching file tree:', error);
        });
}

function buildFileTree(container, nodes, depth, isRoot = false) {
    nodes.forEach(node => {
        if (showFoldersOnly && node.type !== 'directory') {
            // Skip files when "Show Folders Only" is enabled
            return;
        }

        if (node.type === 'directory') {
            buildDirectory(node, container, depth, isRoot);
        } else {
            buildFile(node, container);
        }
    });
}

function buildDirectory(node, container, depth, isRoot) {
    const li = document.createElement('li');
    const icon = document.createElement('i');

    icon.className = (depth < 1) ? 'fa-regular fa-folder-open' : 'fa-regular fa-folder';
    li.setAttribute('data-expanded', (depth < 1) ? 'true' : 'false');
    li.setAttribute('data-depth', depth);  // Set the folder depth here
    li.setAttribute('data-path', node.path);

    li.appendChild(icon);
    li.appendChild(document.createTextNode(` ${node.name}`));

    const subList = document.createElement('ul');
    subList.style.display = (depth < 1) ? 'block' : 'none';

    buildFileTree(subList, node.children, depth + 1);

    li.appendChild(subList);
    container.appendChild(li);

    li.classList.add(isRoot ? 'root-folder' : 'subfolder');
}

function buildFile(node, container) {
    const li = document.createElement('li');
    const icon = document.createElement('i');
    const fileName = node.name.toLowerCase();

    icon.className = getFileIconClass(fileName);

    li.appendChild(icon);
    li.appendChild(document.createTextNode(` ${node.name}`));
    li.classList.add('file-item');

    container.appendChild(li);
}

function getFileIconClass(fileName) {
    if (fileName.endsWith('.mp4') || fileName.endsWith('.mov')) return 'fa-regular fa-file-video';
    if (fileName.endsWith('.png') || fileName.endsWith('.jpg')) return 'fa-regular fa-file-image';
    if (fileName.endsWith('.mp3')) return 'fa-regular fa-file-audio';
    if (fileName.endsWith('.pdf')) return 'fa-regular fa-file-pdf';
    return 'fa-regular fa-file'; // Default case
}

export function collapseAll() {
    document.querySelectorAll('#fileTree li[data-expanded="true"]').forEach(li => {
        const icon = li.querySelector('i');
        const subList = li.querySelector('ul');
        if (subList) {
            subList.style.display = 'none';
            li.setAttribute('data-expanded', 'false');
            icon.className = 'fa-regular fa-folder'; // Change to closed folder icon
        }
    });
}

export function expandAll() {
    document.querySelectorAll('#fileTree li[data-expanded="false"]').forEach(li => {
        const icon = li.querySelector('i');
        const subList = li.querySelector('ul');
        if (subList) {
            subList.style.display = 'block';
            li.setAttribute('data-expanded', 'true');
            icon.className = 'fa-regular fa-folder-open'; // Change to open folder icon
        }
    });
}

export function toggleToSublevel(level) {
    document.querySelectorAll('#fileTree li').forEach(li => {
        const depth = parseInt(li.getAttribute('data-depth'), 10); // Get the depth from the attribute
        const icon = li.querySelector('i');
        const subList = li.querySelector('ul');

        if (subList) {
            if (depth < level) {
                // Expand folders with depth less than the target level
                subList.style.display = 'block';
                li.setAttribute('data-expanded', 'true');
                icon.className = 'fa-regular fa-folder-open';
            } else if (depth === level) {
                // Collapse folders that are exactly at the target level
                subList.style.display = 'none';
                li.setAttribute('data-expanded', 'false');
                icon.className = 'fa-regular fa-folder';
            } else if (depth > level) {
                // Collapse folders that are deeper than the target level
                subList.style.display = 'none';
                li.setAttribute('data-expanded', 'false');
                icon.className = 'fa-regular fa-folder';
            }
        }
    });
}

