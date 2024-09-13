function toggleLeftPanel() {
    var panel = document.getElementById('left-panel');
    var icon = document.querySelector('#left-panel-toggle img');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        icon.src = 'static/images/sidebar-light-white.png'; // Icon when panel is toggled off
    } else {
        panel.style.display = 'block';
        icon.src = 'static/images/sidebar-regular-white.png'; // Icon when panel is toggled on
    }
}

function toggleRightPanel() {
    var panel = document.getElementById('right-panel');
    var icon = document.querySelector('#right-panel-toggle img');
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        icon.src = 'static/images/sidebar-flip-light-white.png'; // Icon when panel is toggled off
    } else {
        panel.style.display = 'block';
        icon.src = 'static/images/sidebar-flip-regular-white.png'; // Icon when panel is toggled on
    }
}

// Add event listeners to ensure functions are only called after the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.left-panel-toggle').addEventListener('click', toggleLeftPanel);
    document.querySelector('.right-panel-toggle').addEventListener('click', toggleRightPanel);
});
