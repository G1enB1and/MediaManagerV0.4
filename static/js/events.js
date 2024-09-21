import { makeResizable } from './resizer.js';
import { updateGallery } from './gallery.js';
import { collapseAll, expandAll, toggleFilesOption, toggleToSublevel } from './fileTree.js';  // Import the missing functions

export function initializeEventListeners() {
    makeResizable();
    attachDropdownListeners();
    attachFileTreeClickListener();
    attachFileTreeDropdownListener();
}

function attachDropdownListeners() {
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.addEventListener('click', toggleDropdown);
    });

    document.addEventListener('click', closeDropdowns);
}

function attachFileTreeClickListener() {
    const fileTreeContainer = document.getElementById('fileTree');

    fileTreeContainer.addEventListener('click', function(event) {
        const clickedElement = event.target;

        // Handle folder name clicks
        if (!clickedElement.classList.contains('fa-folder') && !clickedElement.classList.contains('fa-folder-open')) {
            const parentLi = clickedElement.closest('li');
            let folderPath = parentLi.getAttribute('data-path');

            if (folderPath) {
                folderPath = normalizeFolderPath(folderPath);

                // Fetch images for the clicked folder
                fetch(`/update-images-json?folder=${encodeURIComponent(folderPath)}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Images received from server:', data);
                        updateGallery(data);
                    })
                    .catch(error => {
                        console.error('Error fetching current_images.json:', error);
                    });
            } else {
                console.error('No folder path found');
            }
        }

        // Handle folder icon clicks
        if (clickedElement.classList.contains('fa-folder') || clickedElement.classList.contains('fa-folder-open')) {
            toggleFolder(clickedElement);
        }
    });
}

function attachFileTreeDropdownListener() {
    const dropdownButton = document.getElementById('file-tree-dropdown-btn');
    const dropdownContent = document.getElementById('file-tree-dropdown-content');

    document.getElementById('toggleMultiSelect').addEventListener('click', function() {
        // Code to handle multi-select toggle
        toggleMultiSelect();
    });

    document.getElementById('toggleFilesOption').addEventListener('click', function() {
        toggleFilesOption();
    });
    
    document.getElementById('collapseAll').addEventListener('click', function() {
        collapseAll();  // Call the collapseAll function for the file tree
    });

    document.getElementById('toggleToSublevel1').addEventListener('click', function() {
        toggleToSublevel(1);
    });

    document.getElementById('toggleToSublevel2').addEventListener('click', function() {
        toggleToSublevel(2);
    });

    document.getElementById('toggleToSublevel3').addEventListener('click', function() {
        toggleToSublevel(3);
    });
    
    document.getElementById('expandAll').addEventListener('click', function() {
        expandAll();  // Call the expandAll function for the file tree
    });
    
    dropdownButton.addEventListener('click', function(event) {
        event.stopPropagation();  // Prevent click from bubbling up to other elements

        // Toggle the visibility of the dropdown content
        const isVisible = dropdownContent.style.display === 'block';
        dropdownContent.style.display = isVisible ? 'none' : 'block';
    });

    // Close the dropdown if clicking outside
    document.addEventListener('click', function(event) {
        if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';  // Close dropdown
        }
    });
}

function toggleDropdown(event) {
    event.stopPropagation();
    const dropdown = event.currentTarget.parentElement;
    
    document.querySelectorAll('.dropdown').forEach(item => {
        if (item !== dropdown) {
            item.classList.remove('active');
        }
    });

    dropdown.classList.toggle('active');
}

function closeDropdowns() {
    document.querySelectorAll('.dropdown').forEach(item => {
        item.classList.remove('active');
    });
}

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

function normalizeFolderPath(folderPath) {
    const mediaIndex = folderPath.indexOf('Media/');
    if (mediaIndex !== -1) {
        folderPath = folderPath.substring(mediaIndex);
    }

    return folderPath.replace(/^\/|\/$/g, '');  // Trim leading/trailing slashes
}
