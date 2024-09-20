function toggleLeftPanel() {
    var panel = document.getElementById('left-panel-container');
    var contentArea = document.querySelector('.content-area');
    var icon = document.querySelector('#left-panel-toggle img');
    var resizer = document.getElementById('left-resizer');

    // Check the current display style of the panel to toggle it
    if (panel.style.display === 'block' || panel.style.display === '') {
        panel.style.display = 'none';
        contentArea.style.marginLeft = '0px'; // Expand content area to full width
        resizer.style.display = 'none';
        icon.src = 'static/images/sidebar-light-white.png'; // Icon when panel is toggled off
    } else {
        panel.style.display = 'block';
        /*contentArea.style.marginLeft = '250px'; */ // Restrict content area width
        resizer.style.display = 'block';
        icon.src = 'static/images/sidebar-regular-white.png'; // Icon when panel is toggled on
    }
}

// Toggle Right Panel
function toggleRightPanel() {
    const rightPanel = document.getElementById('right-panel');
    const rightResizer = document.getElementById('right-resizer');
    const contentArea = document.querySelector('.content-area');
    const icon = document.querySelector('#right-panel-toggle img');

    const panelDisplay = window.getComputedStyle(rightPanel).display;

    if (panelDisplay === 'block') {
        rightPanel.style.display = 'none';
        rightResizer.style.display = 'none';
        const leftPanelWidth = leftPanelContainer.getBoundingClientRect().width;
        contentArea.style.width = `calc(100% - ${leftPanelWidth}px)`; // Adjust content area width
        icon.src = 'static/images/sidebar-flip-light-white.png'; // Icon when panel is toggled off
    } else {
        rightPanel.style.display = 'block';
        rightPanel.style.width = '350px'; // Initialize right panel width
        rightResizer.style.display = 'block';
        rightResizer.style.right = '349px'; // Position resizer
        const leftPanelWidth = leftPanelContainer.getBoundingClientRect().width;
        contentArea.style.width = `calc(100% - ${leftPanelWidth + 351}px)`; // Adjust content area width
        icon.src = 'static/images/sidebar-flip-regular-white.png'; // Icon when panel is toggled on
    }
}

// Handle resizing
function makeResizable() {
    const leftResizer = document.getElementById('left-resizer');
    const rightResizer = document.getElementById('right-resizer');
    const leftPanelContainer = document.getElementById('left-panel-container');
    const rightPanel = document.getElementById('right-panel');
    const contentArea = document.querySelector('.content-area');

    let startX, startWidth;

    function initResizer(resizer, side) {
        resizer.addEventListener('mousedown', function(e) {
            e.preventDefault();
            startX = e.clientX;

            if (side === 'left') {
                startWidth = leftPanelContainer.getBoundingClientRect().width;
            } else if (side === 'right') {
                startWidth = rightPanel.getBoundingClientRect().width;
            }

            function resizePanel(e) {
                const newWidth = startWidth + (side === 'left' ? e.clientX - startX : startX - e.clientX);
                
                if (newWidth > 1 && newWidth < 600) {  // Ensure widths stay within reasonable bounds
                    if (side === 'left') {
                        // Update left panel and content-area widths
                        leftPanelContainer.style.width = `${newWidth}px`;
                        leftResizer.style.left = `${newWidth}px`;
                        const rightPanelWidth = rightPanel.getBoundingClientRect().width;
                        contentArea.style.width = `calc(100% - ${newWidth + rightPanelWidth}px)`;
                    } else if (side === 'right') {
                        // Update right panel and content-area widths
                        rightPanel.style.width = `${newWidth}px`;
                        rightResizer.style.right = `${newWidth}px`;
                        const leftPanelWidth = leftPanelContainer.getBoundingClientRect().width;
                        contentArea.style.width = `calc(100% - ${leftPanelWidth + newWidth}px)`;
                    }
                }
            }

            function stopResizePanel() {
                document.removeEventListener('mousemove', resizePanel);
                document.removeEventListener('mouseup', stopResizePanel);
            }

            document.addEventListener('mousemove', resizePanel);
            document.addEventListener('mouseup', stopResizePanel);
        });
    }

    initResizer(leftResizer, 'left');
    initResizer(rightResizer, 'right');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', makeResizable);

// Function to toggle the dropdown visibility
function toggleDropdown(event) {
    event.stopPropagation();  // Prevent the click event from propagating to the document

    const dropdown = event.currentTarget.parentElement;
    
    // Close any open dropdowns
    document.querySelectorAll('.dropdown').forEach(function(item) {
        if (item !== dropdown) {
            item.classList.remove('active');
        }
    });

    // Toggle the current dropdown
    dropdown.classList.toggle('active');
}

// Close the dropdowns if clicking outside
function closeDropdowns(event) {
    document.querySelectorAll('.dropdown').forEach(function(item) {
        item.classList.remove('active');
    });
}

// Attach the toggle function to the dropdown buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dropbtn').forEach(function(btn) {
        btn.addEventListener('click', toggleDropdown);
    });

    // Close dropdowns if clicking outside
    document.addEventListener('click', closeDropdowns);

    makeResizable(document.getElementById('left-resizer'), 'left');
    makeResizable(document.getElementById('right-resizer'), 'right');
});

// File Tree
let showFoldersOnly = false; // Track the current state of the toggle

// Function to populate the file tree
function populateFileTree() {
    const fileTreeContainer = document.getElementById('fileTree');

    // Show a loading indicator while fetching data
    fileTreeContainer.innerHTML = '<li>Loading...</li>';

    // Fetch the file tree from the JSON file
    fetch('/static/file_tree.json')
        .then(response => response.json())
        .then(data => {
            // Clear the loading message
            fileTreeContainer.innerHTML = '';

            // Build the file tree starting from the root (Pictures folder)
            buildFileTree(fileTreeContainer, [data], 0, true);  // Pass root folder data as an array and mark as root
        })
        .catch(error => {
            console.error('Error fetching file tree:', error);
        });
}

// Function to build the file tree dynamically
function buildFileTree(container, nodes, depth = 0, isRoot = false) {
    nodes.forEach(node => {
        const li = document.createElement('li');
        const icon = document.createElement('i');

        // Set the depth for each folder/file
        li.setAttribute('data-depth', depth); // Add depth as a data attribute

        // Only include directories if "Show Folders Only" is active
        if (showFoldersOnly && node.type !== 'directory') {
            return; // Skip files if "Show Folders Only" is enabled
        }

        // File/folder icon logic
        if (node.type === 'directory') {
            if (depth < 1) {
                icon.className = 'fa-regular fa-folder-open'; // Open folder icon for root and first sublevel
                li.setAttribute('data-expanded', 'true');
            } else {
                icon.className = 'fa-regular fa-folder'; // Closed folder icon for deeper levels
                li.setAttribute('data-expanded', 'false');
            }

            // Set data-path attribute to the folder path
            li.setAttribute('data-path', node.path); // Assign the folder path to data-path

            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${node.name}`));

            const subList = document.createElement('ul');

            // Control folder expansion based on depth
            if (depth < 1) {
                subList.style.display = 'block'; // Expand root and first sublevel
            } else {
                subList.style.display = 'none'; // Collapse anything deeper than the first sublevel
            }

            // Recursively build the file tree for subfolders
            buildFileTree(subList, node.children, depth + 1);
            li.appendChild(subList);

            if (isRoot) {
                li.classList.add('root-folder');
            } else {
                li.classList.add('subfolder');
            }
        } else {
            // Set file icon based on file type
            const fileName = node.name.toLowerCase();
            
            // Video file types
            if (fileName.endsWith('.mp4') || fileName.endsWith('.mov') || fileName.endsWith('.avi') || fileName.endsWith('.mkv')) {
                icon.className = 'fa-regular fa-file-video';
            } 
            // Image file types
            else if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.bmp') || fileName.endsWith('.gif')) {
                icon.className = 'fa-regular fa-file-image';
            } 
            // Audio file types (music)
            else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav') || fileName.endsWith('.flac') || fileName.endsWith('.aac') || fileName.endsWith('.ogg')) {
                icon.className = 'fa-regular fa-file-audio';
            } 
            // Document file types
            else if (fileName.endsWith('.pdf')) {
                icon.className = 'fa-regular fa-file-pdf';
            } 
            else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
                icon.className = 'fa-regular fa-file-word';
            } 
            else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
                icon.className = 'fa-regular fa-file-excel';
            } 
            else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
                icon.className = 'fa-regular fa-file-powerpoint';
            } 
            // Code file types
            else if (fileName.endsWith('.html') || fileName.endsWith('.css') || fileName.endsWith('.js') || fileName.endsWith('.py') || fileName.endsWith('.java')) {
                icon.className = 'fa-regular fa-file-code';
            } 
            // Compressed file types
            else if (fileName.endsWith('.zip') || fileName.endsWith('.rar') || fileName.endsWith('.7z') || fileName.endsWith('.tar') || fileName.endsWith('.gz')) {
                icon.className = 'fa-regular fa-file-archive';
            } 
            // Text file types
            else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
                icon.className = 'fa-regular fa-file-alt';
            } 
            // Default catch-all for unknown or generic files
            else {
                icon.className = 'fa-regular fa-file';
            }

            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${node.name}`));
            li.classList.add('file-item');
        }

        container.appendChild(li);
    });
}

function toggleFiles() {
    // Toggle the state
    showFoldersOnly = !showFoldersOnly;

    // Update the text in the dropdown
    const toggleFilesOption = document.getElementById('toggleFilesOption');
    if (showFoldersOnly) {
        toggleFilesOption.textContent = 'Show Files';
    } else {
        toggleFilesOption.textContent = 'Folders Only';
    }

    // Rebuild the file tree with the updated setting
    populateFileTree();
}

// Event delegation to handle folder icon clicks for expand/collapse and folder names for updating images.json
document.addEventListener('DOMContentLoaded', function() {
    const fileTreeContainer = document.getElementById('fileTree');

    // Event delegation: Listen for clicks on folder icons within the file tree
    fileTreeContainer.addEventListener('click', function(event) {
        const clickedElement = event.target;

        // -- update images.json when a folder name is clicked -- //
        // Check if the clicked element is a folder name (not the icon)
        if (!clickedElement.classList.contains('fa-folder') && !clickedElement.classList.contains('fa-folder-open')) {
            const parentLi = clickedElement.closest('li');
            let folderPath = parentLi.getAttribute('data-path'); // Ensure you have folder path data attribute

            if (folderPath) {
                // Convert the full path to a relative path starting from "Media"
                const mediaIndex = folderPath.indexOf('Media/');
                if (mediaIndex !== -1) {
                    folderPath = folderPath.substring(mediaIndex);  // Remove everything before "Media"
                }

                // Remove leading and trailing slashes, if any
                folderPath = folderPath.replace(/^\/|\/$/g, '');

                console.log(`Folder path clicked (relative): ${folderPath}`); // Debugging message

                // Make an AJAX call to update images.json based on the selected folder
                fetch(`/update-images-json?folder=${encodeURIComponent(folderPath)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Update the main content area with the new images/videos from images.json
                        updateGallery(data);
                    })
                    .catch(error => {
                        console.error('Error updating images.json:', error);
                    });
            } else {
                console.error('No folder path found');
            }
        }

        // -- Toggle the folder open or closed when the folder icon is clicked -- //
        // Check if the clicked element is a folder icon (the i.fa-folder element)
        if (clickedElement.classList.contains('fa-folder') || clickedElement.classList.contains('fa-folder-open')) {
            const parentLi = clickedElement.closest('li');
            const subList = parentLi.querySelector('ul');
            const icon = parentLi.querySelector('i');
            const isExpanded = parentLi.getAttribute('data-expanded') === 'true';

            // Toggle the folder open/close state
            if (isExpanded) {
                subList.style.display = 'none';
                icon.className = 'fa-regular fa-folder'; // Change to closed folder icon
                parentLi.setAttribute('data-expanded', 'false');
            } else {
                subList.style.display = 'block';
                icon.className = 'fa-regular fa-folder-open'; // Change to open folder icon
                parentLi.setAttribute('data-expanded', 'true');
            }
        }
    });

    // Function to update the main content with images
    function updateGallery(mediaFiles) {
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = '';  // Clear the content area
    
        mediaFiles.forEach(file => {
            const img = document.createElement('img');
            img.src = file;
            img.classList.add('content-image');  // Apply any specific styling you want
            gallery.appendChild(img);
        });
    }

    // Call the function to populate the file tree
    populateFileTree();
});

/* file tree and drop down menu */
// Attach the click event listener for the file tree dropdown
document.addEventListener('DOMContentLoaded', function () {
    const dropdownButton = document.querySelector('.file-tree-dropbtn');
    const dropdownContent = document.querySelector('.file-tree-dropdown-content');

    dropdownButton.addEventListener('click', function (event) {
        event.stopPropagation();  // Prevent event from propagating to the document
        const isVisible = dropdownContent.style.display === 'block';

        // Toggle the dropdown visibility
        if (isVisible) {
            dropdownContent.style.display = 'none';
        } else {
            dropdownContent.style.display = 'block';
        }
    });

    // Close dropdown if clicking outside
    document.addEventListener('click', function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';  // Close dropdown
        }
    });
});

// Collapse all folders
function collapseAll() {
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

// Expand all folders
function expandAll() {
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

// Expand/Collapse to specific sublevel
function toggleToSublevel(level) {
    document.querySelectorAll('#fileTree li').forEach(li => {
        const depth = parseInt(li.getAttribute('data-depth'), 10); // Get the depth from the attribute
        const icon = li.querySelector('i');
        const subList = li.querySelector('ul');

        if (subList) {
            // If the depth is less than or equal to the target level, expand the folder
            if (depth < level) {
                subList.style.display = 'block'; // Expand
                li.setAttribute('data-expanded', 'true');
                icon.className = 'fa-regular fa-folder-open';
            } 
            // If the depth is greater than the target level, collapse the folder
            else if (depth >= level) {
                subList.style.display = 'none'; // Collapse
                li.setAttribute('data-expanded', 'false');
                icon.className = 'fa-regular fa-folder';
            }
        }
    });
}