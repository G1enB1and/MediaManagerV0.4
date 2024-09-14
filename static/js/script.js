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
