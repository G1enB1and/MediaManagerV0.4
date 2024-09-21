import { populateFileTree } from './fileTree.js';
import { initializeEventListeners } from './events.js';
import { loadRootImages } from './gallery.js';
import { toggleLeftPanel, toggleRightPanel } from './panels.js';

document.addEventListener('DOMContentLoaded', () => {
    initPage();

    // Attach the panel toggle functions to their respective buttons
    document.getElementById('left-panel-toggle').addEventListener('click', toggleLeftPanel);
    document.getElementById('right-panel-toggle').addEventListener('click', toggleRightPanel);

    // Attach the panel toggle functions to the View dropdown items
    document.getElementById('view-toggle-left-panel').addEventListener('click', toggleLeftPanel);
    document.getElementById('view-toggle-right-panel').addEventListener('click', toggleRightPanel);
});

function initPage() {
    loadRootImages();       // Load images from the root "Media" folder
    populateFileTree();      // Populate the file tree
    initializeEventListeners();  // Set up event listeners
}
