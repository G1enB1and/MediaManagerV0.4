let currentPage = 1;
const itemsPerPage = 60; // Number of images per page
let totalPages = 0;

export function loadRootImages() {
    fetch('/update-images-json?folder=Media')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            totalPages = Math.ceil(data.length / itemsPerPage); // Calculate total pages
            updateGallery(data, currentPage);  // Load gallery with pagination
            renderPagination(totalPages);  // Create pagination
        })
        .catch(error => {
            console.error('Error fetching images for the root "Media" folder on page load:', error);
        });
}

export function updateGallery(mediaFiles, page = 1) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';  // Clear the gallery

    // Calculate start and end indices for pagination
    const start = (page - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, mediaFiles.length);
    const paginatedItems = mediaFiles.slice(start, end);

    paginatedItems.forEach(file => {
        const img = document.createElement('img');
        img.src = file;
        img.classList.add('content-image');  // Add any styling here
        img.setAttribute('loading', 'lazy');  // Enable lazy loading
        gallery.appendChild(img);
    });
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';  // Clear pagination container

    // Create previous page button
    if (currentPage > 1) {
        const prevButton = document.createElement('a');
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.href = '#';
        prevButton.classList.add('prev');
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            loadRootImages(); // Reload images for the new page
        });
        pagination.appendChild(prevButton);
    }

    // Create numbered page buttons
    const ul = document.createElement('ul');
    pagination.appendChild(ul);

    // Logic for showing a range of page numbers (similar to your old project)
    if (totalPages <= 7) {
        // Show all pages if total pages is less than or equal to 7
        for (let i = 1; i <= totalPages; i++) {
            ul.appendChild(createPageButton(i));
        }
    } else {
        ul.appendChild(createPageButton(1)); // Always show the first page
        if (currentPage > 4) {
            const li = document.createElement('li');
            li.textContent = '...'; // Ellipsis for skipped pages
            ul.appendChild(li);
        }
        let startPage = Math.max(2, currentPage - 2);
        let endPage = Math.min(totalPages - 1, currentPage + 2);
        for (let i = startPage; i <= endPage; i++) {
            ul.appendChild(createPageButton(i));
        }
        if (currentPage < totalPages - 3) {
            const li = document.createElement('li');
            li.textContent = '...'; // Ellipsis for skipped pages
            ul.appendChild(li);
        }
        ul.appendChild(createPageButton(totalPages)); // Always show the last page
    }

    // Create next page button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('a');
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.href = '#';
        nextButton.classList.add('next');
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            loadRootImages(); // Reload images for the new page
        });
        pagination.appendChild(nextButton);
    }
}

function createPageButton(page) {
    const li = document.createElement('li');
    if (page === currentPage) {
        li.classList.add('current');
    }
    const a = document.createElement('a');
    a.href = '#';
    a.textContent = page;
    a.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = page;
        loadRootImages(); // Reload images for the new page
    });
    li.appendChild(a);
    return li;
}
