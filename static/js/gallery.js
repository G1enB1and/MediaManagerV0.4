// gallery.js
export let currentPage = 1;
const itemsPerPage = 60;
export let totalPages = 0;

export function loadRootImages() {
    fetch('/update-images-json?folder=Media')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            totalPages = Math.ceil(data.length / itemsPerPage);
            updateGallery(data, currentPage);
            renderPagination(totalPages);
        })
        .catch(error => {
            console.error('Error fetching images:', error);
        });
}

export function updateGallery(mediaFiles, page = 1) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    // Create masonry columns (adjust the number of columns as needed)
    const columnCount = 4;
    const masonryColumns = [];

    // Toast notification elements
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const progressBar = document.getElementById('progress-bar');

    // Total number of images to load
    const totalImages = mediaFiles.length;
    let imagesLoaded = 0;

    // Display the toast notification
    function showToast() {
        toast.classList.add('show');
    }

    // Update the toast message and progress bar
    function updateToast() {
        const percentage = (imagesLoaded / totalImages) * 100;
        toastMessage.textContent = `Loading image ${imagesLoaded} out of ${totalImages}`;
        progressBar.style.width = `${percentage}%`;
    }

    // Hide the toast notification when loading is complete
    function hideToast() {
        toast.classList.remove('show');
    }

    // Show the toast when the gallery starts loading
    showToast();

    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.classList.add('masonry-column');
        masonryColumns.push(column);
        gallery.appendChild(column);
    }

    // Distribute the items into columns for masonry effect
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, mediaFiles.length);

    mediaFiles.slice(start, end).forEach((file, index) => {
        const item = document.createElement('div');
        item.classList.add('masonry-item');

        let mediaElement;
        if (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi') || file.endsWith('.mkv')) {
            mediaElement = document.createElement('video');
            mediaElement.src = file;
            mediaElement.controls = true;
            mediaElement.preload = 'metadata';

            mediaElement.onloadedmetadata = () => {
                mediaElement.classList.add('loaded');
                // Dynamically calculate and set the height based on aspect ratio
                const aspectRatio = mediaElement.videoHeight / mediaElement.videoWidth;
                item.style.height = `${item.offsetWidth * aspectRatio}px`;
                imagesLoaded++;
                updateToast();

                if (imagesLoaded === totalImages) {
                    hideToast();  // Hide the toast once all images are loaded
                }
            };

            mediaElement.onerror = () => {
                console.error('Error loading video:', file);
                imagesLoaded++;
                updateToast();
            };
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = file;

            mediaElement.onload = () => {
                mediaElement.classList.add('loaded');
                // Dynamically calculate and set the height based on aspect ratio
                const aspectRatio = mediaElement.naturalHeight / mediaElement.naturalWidth;
                item.style.height = `${item.offsetWidth * aspectRatio}px`;
                imagesLoaded++;
                updateToast();

                if (imagesLoaded === totalImages) {
                    hideToast();  // Hide the toast once all images are loaded
                }
            };

            mediaElement.onerror = () => {
                console.error('Error loading image:', file);
                imagesLoaded++;
                updateToast();
            };
        }

        mediaElement.classList.add('lazy-media');
        item.appendChild(mediaElement);

        // Append item to one of the masonry columns in a round-robin fashion
        // Initially set the height to the width (1:1 ratio) until the image loads
        item.style.height = `${item.offsetWidth}px`;
        
        masonryColumns[index % columnCount].appendChild(item);
    });
}

export function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('a');
        prevButton.innerHTML = '&lt;';
        prevButton.href = '#';
        prevButton.classList.add('prev');
        prevButton.onclick = (e) => {
            e.preventDefault();
            updatePage(currentPage - 1);
        };
        pagination.appendChild(prevButton);
    }

    // Page number buttons
    const ul = document.createElement('ul');
    pagination.appendChild(ul);

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            ul.appendChild(createPageButton(i));
        }
    } else {
        ul.appendChild(createPageButton(1));
        if (currentPage > 4) {
            const li = document.createElement('li');
            li.textContent = '...';
            ul.appendChild(li);
        }

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            ul.appendChild(createPageButton(i));
        }

        if (currentPage < totalPages - 2) {
            const li = document.createElement('li');
            li.textContent = '...';
            ul.appendChild(li);
        }

        ul.appendChild(createPageButton(totalPages));
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('a');
        nextButton.innerHTML = '&gt;';
        nextButton.href = '#';
        nextButton.classList.add('next');
        nextButton.onclick = (e) => {
            e.preventDefault();
            updatePage(currentPage + 1);
        };
        pagination.appendChild(nextButton);
    }
}

function createPageButton(page) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = page;

    if (page === currentPage) {
        li.classList.add('current');
    }

    a.onclick = (e) => {
        e.preventDefault();
        updatePage(page);
    };
    li.appendChild(a);
    return li;
}

function updatePage(newPage) {
    currentPage = newPage;
    loadRootImages();

    // Scroll to the top of the gallery container
    const galleryContainer = document.querySelector('.gallery-container');
    galleryContainer.scrollTop = 0;
}

window.addEventListener('resize', () => {
    const loadedItems = document.querySelectorAll('.masonry-item img.loaded, .masonry-item video.loaded');
    loadedItems.forEach((item) => {
        const container = item.closest('.masonry-item');
        const aspectRatio = item.naturalHeight / item.naturalWidth || item.videoHeight / item.videoWidth;
        container.style.height = `${container.offsetWidth * aspectRatio}px`;
    });
});