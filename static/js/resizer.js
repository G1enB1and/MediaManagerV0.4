export function makeResizable() {
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

                if (newWidth > 1 && newWidth < 600) {
                    if (side === 'left') {
                        leftPanelContainer.style.width = `${newWidth}px`;
                        leftResizer.style.left = `${newWidth}px`;
                        const rightPanelWidth = rightPanel.getBoundingClientRect().width;
                        contentArea.style.width = `calc(100% - ${newWidth + rightPanelWidth}px)`;
                    } else if (side === 'right') {
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
