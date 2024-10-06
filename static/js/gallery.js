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

    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, mediaFiles.length);

    let itemsLoaded = 0;
    const totalItems = end - start;

    mediaFiles.slice(start, end).forEach(file => {
        const item = document.createElement('div');
        item.classList.add('masonry-item');

        let mediaElement;
        if (file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi') || file.endsWith('.mkv')) {
            mediaElement = document.createElement('video');
            mediaElement.src = file;
            mediaElement.controls = true;
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = file;
        }

        mediaElement.classList.add('lazy-media');
        mediaElement.setAttribute('loading', 'lazy');
        mediaElement.style.opacity = '0';  // Set initial opacity to 0
        item.appendChild(mediaElement);
        gallery.appendChild(item);

        // Event listener to track when each media is loaded
        const onLoadHandler = () => {
            itemsLoaded++;
            if (itemsLoaded === totalItems) {
                fadeInLoadedItems();
            }
        };

        mediaElement.onload = onLoadHandler;
        mediaElement.onloadeddata = onLoadHandler;  // For video elements
    });

    function fadeInLoadedItems() {
        document.querySelectorAll('.lazy-media').forEach(media => {
            media.style.transition = 'opacity 0.5s ease';
            media.style.opacity = '1';
        });
    }
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
}
