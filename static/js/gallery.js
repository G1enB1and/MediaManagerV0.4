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
    mediaFiles.slice(start, end).forEach(file => {
        const img = document.createElement('img');
        img.src = file;
        img.classList.add('content-image');
        img.setAttribute('loading', 'lazy');
        gallery.appendChild(img);
    });
}

export function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; 

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement('a');
        prevButton.innerHTML = '&lt;';  // Original left arrow symbol
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
        // Show all pages if total pages <= 7
        for (let i = 1; i <= totalPages; i++) {
            ul.appendChild(createPageButton(i));
        }
    } else {
        ul.appendChild(createPageButton(1)); // First page

        if (currentPage > 4) {
            const li = document.createElement('li');
            li.textContent = '...'; // Ellipsis
            ul.appendChild(li);
        }

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            ul.appendChild(createPageButton(i));
        }

        if (currentPage < totalPages - 2) {
            const li = document.createElement('li');
            li.textContent = '...'; // Ellipsis
            ul.appendChild(li);
        }

        ul.appendChild(createPageButton(totalPages)); // Last page
    }

    // Next button
    if (currentPage < totalPages) {
        const nextButton = document.createElement('a');
        nextButton.innerHTML = '&gt;';  // Original right arrow symbol
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