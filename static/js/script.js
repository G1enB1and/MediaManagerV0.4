function toggleLeftPanel() {
    var panel = document.getElementById('left-panel');
    var icon = document.querySelector('#left-panel-toggle img');
    var resizer = document.getElementById('left-resizer');

    // Check actual computed style of the left panel
    var panelDisplay = window.getComputedStyle(panel).display;

    if (panelDisplay === 'block') {
        panel.style.display = 'none';
        resizer.style.display = 'none';
        icon.src = 'static/images/sidebar-light-white.png'; // Icon when panel is toggled off
    } else {
        panel.style.display = 'block';
        resizer.style.display = 'block';
        icon.src = 'static/images/sidebar-regular-white.png'; // Icon when panel is toggled on
    }
}

function toggleRightPanel() {
    var panel = document.getElementById('right-panel');
    var icon = document.querySelector('#right-panel-toggle img');
    var resizer = document.getElementById('right-resizer');

    // Check actual computed style of the right panel
    var panelDisplay = window.getComputedStyle(panel).display;

    if (panelDisplay === 'block') {
        panel.style.display = 'none';
        resizer.style.display = 'none';
        icon.src = 'static/images/sidebar-flip-light-white.png'; // Icon when panel is toggled off
    } else {
        panel.style.display = 'block';
        resizer.style.display = 'block';
        icon.src = 'static/images/sidebar-flip-regular-white.png'; // Icon when panel is toggled on
    }
}

// Handle resizing
function makeResizable(resizer, side) {
    let startX = 0;
    let startWidth = 0;

    resizer.addEventListener('mousedown', function(e) {
        startX = e.clientX;
        startWidth = side === 'left' ? document.getElementById('left-panel').offsetWidth : document.getElementById('right-panel').offsetWidth;
        document.body.classList.add('is-resizing');

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        if (side === 'left') {
            const newWidth = startWidth + (e.clientX - startX);
            document.getElementById('left-panel').style.width = newWidth + 'px';
            resizer.style.left = newWidth + 'px';
        } else {
            const newWidth = startWidth - (e.clientX - startX);
            document.getElementById('right-panel').style.width = newWidth + 'px';
            resizer.style.right = newWidth + 'px';
        }
    }

    function stopResize() {
        document.body.classList.remove('is-resizing');
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    makeResizable(document.getElementById('left-resizer'), 'left');
    makeResizable(document.getElementById('right-resizer'), 'right');
});

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

//File Tree
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
            buildFileTree(fileTreeContainer, [data], true);  // Pass root folder data as an array and mark as root
        })
        .catch(error => {
            console.error('Error fetching file tree:', error);
        });
}

// Function to build the file tree dynamically
function buildFileTree(container, nodes, isRoot = false) {
    nodes.forEach(node => {
        const li = document.createElement('li');
        const icon = document.createElement('i');

        if (node.type === 'directory') {
            icon.className = 'fa-regular fa-folder-open';
            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${node.name}`));

            const subList = document.createElement('ul');
            subList.style.display = 'block';
            buildFileTree(subList, node.children);
            li.appendChild(subList);

            if (!isRoot) {
                li.classList.add('subfolder');
            } else {
                li.classList.add('root-folder');
            }

            li.setAttribute('data-expanded', 'true');
        } else {
            icon.className = 'fa-regular fa-file';
            li.appendChild(icon);
            li.appendChild(document.createTextNode(` ${node.name}`));
            li.classList.add('file-item');
        }

        container.appendChild(li);
    });
}

// Event delegation to handle folder icon clicks for expand/collapse
document.addEventListener('DOMContentLoaded', function() {
    const fileTreeContainer = document.getElementById('fileTree');

    // Event delegation: Listen for clicks on folder icons within the file tree
    fileTreeContainer.addEventListener('click', function(event) {
        const clickedElement = event.target;

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

    // Call the function to populate the file tree
    populateFileTree();
});
