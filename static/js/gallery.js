window.addEventListener('load', function() {
    // Gallery image loading code here
    fetch('/update-images-json?folder=Media')
        .then(response => response.json())
        .then(data => {
            console.log('Images loaded on page load:', data);
            updateGallery(data);  // This function updates the gallery
        })
        .catch(error => {
            console.error('Error fetching gallery images:', error);
        });
});

export function loadRootImages() {
    fetch('/update-images-json?folder=Media')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Images loaded on page load:', data);
            updateGallery(data);  // Populate the gallery
        })
        .catch(error => {
            console.error('Error fetching images for the root "Media" folder on page load:', error);
        });
}

export function updateGallery(mediaFiles) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';  // Clear the gallery

    mediaFiles.forEach(file => {
        const img = document.createElement('img');
        img.src = file;
        img.classList.add('content-image');  // Add any styling here
        img.setAttribute('loading', 'lazy');  // Enable lazy loading
        gallery.appendChild(img);
    });
}