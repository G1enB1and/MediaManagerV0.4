//events.js
import { makeResizable } from './resizer.js';
import { currentPage, totalPages, loadRootImages, updateGallery, renderPagination, setCurrentPage, setTotalPages, itemsPerPage } from './gallery.js';
import { collapseAll, expandAll, toggleFilesOption, toggleToSublevel } from './fileTree.js';  // Import the missing functions

let selectedFolders = new Set();  // Track the selected folders

export function initializeEventListeners() {
    makeResizable();
    attachDropdownListeners();
    attachFileTreeClickListener();
    attachFileTreeDropdownListener();
    attachPaginationListeners();

    // Load the root folder (Media) by default when the page loads
    loadRootFolder();
}

function loadRootFolder() {
    const rootFolder = '';
    selectedFolders.clear();  // Clear previous selections
    selectedFolders.add(rootFolder);  // Add the root folder to the selection

    // Fetch images for the root folder
    notifyGalleryUpdate();
}

function attachFileTreeClickListener() {
    const fileTreeContainer = document.getElementById('fileTree');

    fileTreeContainer.addEventListener('click', function(event) {
        const clickedElement = event.target;

        // Handle folder name clicks (not the icon)
        if (!clickedElement.classList.contains('fa-folder') && !clickedElement.classList.contains('fa-folder-open')) {
            const parentLi = clickedElement.closest('li');
            let folderPath = parentLi.getAttribute('data-path');

            if (folderPath) {
                if (folderPath === 'Media') {
                    // If the root folder ("Media") is clicked
                    clearFolderSelection();
                    selectedFolders.clear();
                    selectedFolders.add('');  // Select the root folder ('' works)
                    notifyGalleryUpdate(); // call before normalizing paths for root directory.
                } else {
                    folderPath = normalizeFolderPath(folderPath);

                    // Detect if Ctrl is pressed
                    if (event.ctrlKey) {
                        console.log('Ctrl+Click detected');  // Debug log
                        // Handle multi-selection by adding/removing from selectedFolders
                        if (selectedFolders.has(folderPath)) {
                            selectedFolders.delete(folderPath);  // Unselect if already selected
                            parentLi.classList.remove('selected-folder');  // Unhighlight
                        } else {
                            selectedFolders.add(folderPath);  // Add to selection
                            parentLi.classList.add('selected-folder');  // Highlight
                        }
                    } else {
                        // Normal click behavior (clears selection and selects clicked folder)
                        clearFolderSelection();
                        selectedFolders.clear();
                        selectedFolders.add(folderPath);
                        parentLi.classList.add('selected-folder');
                    }
                }

                // update the gallery for the selected folders
                notifyGalleryUpdate();
                
            } else {
                console.error('No folder path found');
            }
        }

        // Handle folder icon clicks (expansion/collapse)
        if (clickedElement.classList.contains('fa-folder') || clickedElement.classList.contains('fa-folder-open')) {
            toggleFolder(clickedElement);
        }
    });
}

// Clear previously selected folders' background
function clearFolderSelection() {
    document.querySelectorAll('.selected-folder').forEach(li => {
        li.classList.remove('selected-folder');  // Remove the highlight
    });
}

// Notify events.js to update the gallery
function notifyGalleryUpdate() {
    const folderPaths = Array.from(selectedFolders);  // Convert set to array
    const event = new CustomEvent('folderSelected', { detail: folderPaths });
    window.dispatchEvent(event);  // Dispatch the custom event
}

// Normalize the folder path (assumes "Media/" is the root for media files)
function normalizeFolderPath(folderPath) {
    const mediaIndex = folderPath.indexOf('Media/');
    if (mediaIndex !== -1) {
        folderPath = folderPath.substring(mediaIndex + 'Media/'.length);  // Strip "Media/"
    }
    return folderPath.replace(/^\/|\/$/g, '');  // Trim leading/trailing slashes
}

function updateCurrentImagesJson(folderPaths) {
    // Call the backend to update current_images.json with images from selected folders
    fetch(`/update-images-json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ folders: folderPaths })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Updated current_images.json with images from folders:', data);
        // Reset pagination state
        setCurrentPage(1);
        const pages = Math.ceil(data.length / itemsPerPage);
        setTotalPages(pages);
        // Update the gallery with the new images and re-render pagination
        updateGallery(data, 1);
        renderPagination(pages);
    })
    .catch(error => {
        console.error('Error updating current_images.json:', error);
    });
}

// Listen for the custom event from fileTree.js to update the gallery
window.addEventListener('folderSelected', function(event) {
    const folderPaths = event.detail;
    console.log('Custom event detected: folderSelected with paths:', folderPaths);

    // Call the function to update images based on selected folders
    updateCurrentImagesJson(folderPaths);
});

/* no longer used */
/*
// Fetch and update gallery for selected folders
function updateGalleryForSelectedFolders(folderPaths) {
    console.log('Folder paths being sent to backend:', folderPaths);

    fetch(`/update-images-json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folders: folderPaths })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Gallery updated with images:', data);
        updateGallery(data, 1);  // Reset to page 1
    })
    .catch(error => {
        console.error('Error updating gallery for selected folders:', error);
    });
}
*/

export function attachPaginationListeners() {
    const pagination = document.getElementById('pagination');
    pagination.addEventListener('click', function (event) {
        event.preventDefault();
        const target = event.target;

        if (target.tagName === 'A' && target.classList.contains('prev')) {
            if (currentPage > 1) {
                currentPage--;  // Update current page
                loadRootImages();
            }
        } else if (target.tagName === 'A' && target.classList.contains('next')) {
            if (currentPage < totalPages) {
                currentPage++;  // Update current page
                loadRootImages();
            }
        } else if (target.tagName === 'A' && !target.classList.contains('current')) {
            let newPage = parseInt(target.textContent);  // Use 'let' for reassignment
            if (newPage) {
                currentPage = newPage;
                loadRootImages();
            }
        }
    });
}

function attachDropdownListeners() {
    document.querySelectorAll('.dropbtn').forEach(btn => {
        btn.addEventListener('click', toggleDropdown);
    });

    document.addEventListener('click', closeDropdowns);
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


