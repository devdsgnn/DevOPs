// Content script that adds "Save" button to images
// Similar to Pinterest's save button

let saveButton = null;
let currentImage = null;

// Create the save button element
function createSaveButton() {
    const button = document.createElement('div');
    button.id = 'image-saver-button';
    button.innerHTML = 'Save';
    button.style.cssText = `
        position: fixed;
        background: #007AFF;
        color: white;
        padding: 6px 12px;
        margin: 0;
        border-radius: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        z-index: 2147483647;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: none;
        transition: opacity 0.15s ease;
        user-select: none;
        letter-spacing: -0.01em;
        white-space: nowrap;
        width: auto;
        max-width: 70px;
        text-align: center;
        border: none;
        outline: none;
        pointer-events: auto;
        box-sizing: border-box;
    `;

    button.addEventListener('mouseenter', () => {
        button.style.background = '#0051D5';
        button.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.18)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.background = '#007AFF';
        button.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
    });

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Show loading feedback immediately
        saveButton.innerHTML = 'Saving...';
        saveButton.style.opacity = '0.7';
        repositionButton();

        let isActuallySaving = false;

        // Show channel selector modal
        window.channelSelector.setCallback((channels) => {
            isActuallySaving = true;
            saveImage(currentImage, channels);
        });

        window.channelSelector.setCancelCallback(() => {
            if (!isActuallySaving) {
                // Reset button if cancelled
                saveButton.innerHTML = 'Save';
                saveButton.style.opacity = '1';
                repositionButton();
            }
        });

        window.channelSelector.show();
    });

    document.body.appendChild(button);
    return button;
}

// Check if image is large enough to show save button
function isImageLargeEnough(img) {
    const rect = img.getBoundingClientRect();
    return rect.width >= 150 && rect.height >= 150;
}

// Get post URL for social media sites
function getPostUrl(img) {
    const url = window.location.href;

    // Twitter/X - find tweet link and extract username
    if (url.includes('twitter.com') || url.includes('x.com')) {
        // Try to find the article containing this image
        const article = img.closest('article');
        if (article) {
            // Find the main tweet link (status link)
            const tweetLink = article.querySelector('a[href*="/status/"]');
            if (tweetLink) {
                return tweetLink.href;
            }
        }

        // Fallback: if we're already on a status page, use that URL
        if (url.includes('/status/')) {
            return url;
        }
    }

    // Instagram - get post link
    if (url.includes('instagram.com')) {
        const postLink = document.querySelector('a[href*="/p/"]');
        if (postLink) {
            return postLink.href;
        }
    }

    // Pinterest - get pin link
    if (url.includes('pinterest.com')) {
        const pinLink = img.closest('a[href*="/pin/"]');
        if (pinLink) {
            return pinLink.href;
        }
    }

    // Default: return current page URL
    return window.location.href;
}

// Extract username from X/Twitter post
function getTwitterUsername(postUrl) {
    if (!postUrl || (!postUrl.includes('twitter.com') && !postUrl.includes('x.com'))) {
        return null;
    }

    // Extract username from URL like: https://x.com/lostdoesart/status/2000670659828195461
    const match = postUrl.match(/(?:twitter\.com|x\.com)\/([^\/]+)\/status/);
    if (match && match[1]) {
        return '@' + match[1];
    }

    return null;
}

// Show save button on image hover
function handleImageHover(e) {
    const img = e.target;

    if (!isImageLargeEnough(img)) {
        return;
    }

    if (!saveButton) {
        saveButton = createSaveButton();
    }

    currentImage = img;
    const rect = img.getBoundingClientRect();

    // Make button visible first to get its width
    saveButton.style.display = 'block';
    saveButton.style.opacity = '0';

    // Force layout calculation
    const buttonWidth = saveButton.offsetWidth || 70; // fallback to max-width

    // Use fixed positioning relative to viewport
    saveButton.style.opacity = '1';
    saveButton.style.top = (rect.top + 8) + 'px';
    saveButton.style.left = (rect.right - buttonWidth - 8) + 'px';
}

// Show save button on video hover
function handleVideoHover(e) {
    const video = e.target;

    // Check if video is large enough
    const rect = video.getBoundingClientRect();
    if (rect.width < 150 || rect.height < 150) {
        return;
    }

    if (!saveButton) {
        saveButton = createSaveButton();
    }

    currentImage = video; // Store video element

    // Make button visible first to get its width
    saveButton.style.display = 'block';
    saveButton.style.opacity = '0';

    // Force layout calculation
    const buttonWidth = saveButton.offsetWidth || 70; // fallback to max-width

    // Use fixed positioning relative to viewport
    saveButton.style.opacity = '1';
    saveButton.style.top = (rect.top + 8) + 'px';
    saveButton.style.left = (rect.right - buttonWidth - 8) + 'px';
}

// Hide save button
function hideSaveButton(e) {
    if (!saveButton) return;

    // Don't hide if hovering over the button itself
    if (e.relatedTarget === saveButton || saveButton.contains(e.relatedTarget)) {
        return;
    }

    setTimeout(() => {
        if (saveButton && !saveButton.matches(':hover')) {
            saveButton.style.opacity = '0';
            setTimeout(() => {
                if (saveButton && saveButton.style.opacity === '0') {
                    saveButton.style.display = 'none';
                }
            }, 150);
        }
    }, 100);
}

// Reposition button (used when button width changes)
function repositionButton() {
    if (!saveButton || !currentImage) return;

    const rect = currentImage.getBoundingClientRect();
    const buttonWidth = saveButton.offsetWidth || 70;

    saveButton.style.top = (rect.top + 8) + 'px';
    saveButton.style.left = (rect.right - buttonWidth - 8) + 'px';
}

// Save image to Discord
async function saveImage(img, channels) {
    try {
        // Show loading state
        saveButton.innerHTML = 'Saving...';
        saveButton.style.pointerEvents = 'none';
        saveButton.style.opacity = '0.6';
        repositionButton(); // Reposition after text change

        // Get image URL
        let imageUrl = img.src || img.dataset.src || img.currentSrc;

        // Get post URL (for social media)
        const postUrl = getPostUrl(img);

        // Get page title - use username for X/Twitter
        let pageTitle = document.title;
        const twitterUsername = getTwitterUsername(postUrl);
        if (twitterUsername) {
            pageTitle = twitterUsername;
        }

        // Get image URL or capture video frame
        let imageDataUrl;

        if (img.tagName === 'VIDEO') {
            // Capture first frame of video
            const canvas = document.createElement('canvas');
            canvas.width = img.videoWidth || img.clientWidth;
            canvas.height = img.videoHeight || img.clientHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            imageDataUrl = canvas.toDataURL('image/png');
        } else {
            // Fetch the image and convert to base64
            let imageUrl = img.src || img.dataset.src || img.currentSrc;
            const imageResponse = await fetch(imageUrl);
            const imageBlob = await imageResponse.blob();

            const reader = new FileReader();
            imageDataUrl = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(imageBlob);
            });
        }

        // Determine if this is from a social media site
        const isSocialMedia = window.location.href.includes('twitter.com') ||
            window.location.href.includes('x.com') ||
            window.location.href.includes('instagram.com') ||
            window.location.href.includes('pinterest.com');

        // Send directly to backend
        const response = await fetch('http://localhost:3001/api/save-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageDataUrl: imageDataUrl,
                postUrl: isSocialMedia ? postUrl : window.location.href,
                pageTitle: pageTitle,
                isSocialMedia: isSocialMedia,
                channels: channels
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save');
        }

        const result = await response.json();

        if (result.success) {
            saveButton.innerHTML = 'Saved';
            saveButton.style.background = '#34C759';
            saveButton.style.opacity = '1';
            repositionButton(); // Reposition after text change

            setTimeout(() => {
                saveButton.innerHTML = 'Save';
                saveButton.style.background = '#007AFF';
                saveButton.style.pointerEvents = 'auto';
                saveButton.style.display = 'none';
                repositionButton(); // Reposition after text change
            }, 1500);
        } else {
            throw new Error(result.error || 'Failed to save');
        }

    } catch (error) {
        console.error('Error saving image:', error);
        saveButton.innerHTML = 'Error';
        saveButton.style.background = '#FF3B30';
        saveButton.style.opacity = '1';
        repositionButton(); // Reposition after text change

        setTimeout(() => {
            saveButton.innerHTML = 'Save';
            saveButton.style.background = '#007AFF';
            saveButton.style.pointerEvents = 'auto';
            repositionButton(); // Reposition after text change
        }, 2000);
    }
}

// Add event listeners to all images and videos
function attachImageListeners() {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');

    images.forEach(img => {
        if (img.dataset.imageSaverAttached) return;

        img.addEventListener('mouseenter', handleImageHover);
        img.addEventListener('mouseleave', hideSaveButton);
        img.dataset.imageSaverAttached = 'true';
    });

    videos.forEach(video => {
        if (video.dataset.imageSaverAttached) return;

        // Listen on both video and its parent container
        video.addEventListener('mouseenter', handleVideoHover);
        video.addEventListener('mouseleave', hideSaveButton);

        // Also listen on parent to catch hover when controls are visible
        const parent = video.parentElement;
        if (parent) {
            parent.addEventListener('mouseenter', (e) => {
                // Only trigger if hovering over the video area
                const rect = video.getBoundingClientRect();
                if (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    handleVideoHover({ target: video });
                }
            });
        }

        video.dataset.imageSaverAttached = 'true';
    });
}

// Hide button when leaving save button
if (saveButton) {
    saveButton.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (saveButton && !currentImage?.matches(':hover')) {
                saveButton.style.display = 'none';
            }
        }, 100);
    });
}

// Initial attachment
attachImageListeners();

// Watch for new images (for dynamic content)
const observer = new MutationObserver(() => {
    attachImageListeners();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('📌 Image Saver extension loaded');
