export function toggleLeftPanel() {
    const panel = document.getElementById('left-panel-container');
    const contentArea = document.querySelector('.content-area');
    const icon = document.querySelector('#left-panel-toggle img');
    const resizer = document.getElementById('left-resizer');

    if (panel.style.display === 'block' || panel.style.display === '') {
        panel.style.display = 'none';
        contentArea.style.marginLeft = '0px';
        resizer.style.display = 'none';
        icon.src = 'static/images/sidebar-light-white.png';
    } else {
        panel.style.display = 'block';
        resizer.style.display = 'block';
        icon.src = 'static/images/sidebar-regular-white.png';
    }

    // Recalculate the height of each loaded item (images/videos) after showing/hiding the left panel
    recalculateItemHeights();
}

export function toggleRightPanel() {
    const rightPanel = document.getElementById('right-panel');
    const rightResizer = document.getElementById('right-resizer');
    const contentArea = document.querySelector('.content-area');
    const leftPanelContainer = document.getElementById('left-panel-container'); // Declare the leftPanelContainer
    const icon = document.querySelector('#right-panel-toggle img');

    const panelDisplay = window.getComputedStyle(rightPanel).display;

    if (panelDisplay === 'block') {
        rightPanel.style.display = 'none';
        rightResizer.style.display = 'none';
        const leftPanelWidth = leftPanelContainer.getBoundingClientRect().width;
        contentArea.style.width = `calc(100% - ${leftPanelWidth}px)`;
        icon.src = 'static/images/sidebar-flip-light-white.png';
    } else {
        rightPanel.style.display = 'block';
        rightPanel.style.width = '350px';
        rightResizer.style.display = 'block';
        rightResizer.style.right = '349px';
        const leftPanelWidth = leftPanelContainer.getBoundingClientRect().width;
        contentArea.style.width = `calc(100% - ${leftPanelWidth + 351}px)`;
        icon.src = 'static/images/sidebar-flip-regular-white.png';
    }

    // Recalculate the height of each loaded item (images/videos) after showing/hiding the right panel
    recalculateItemHeights();
}

function recalculateItemHeights() {
    const loadedItems = document.querySelectorAll('.masonry-item img.loaded, .masonry-item video.loaded');
    loadedItems.forEach((item) => {
        const container = item.closest('.masonry-item');
        const aspectRatio = item.naturalHeight / item.naturalWidth || item.videoHeight / item.videoWidth;
        container.style.height = `${container.offsetWidth * aspectRatio}px`;
    });
}