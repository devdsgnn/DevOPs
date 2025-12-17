// Background service worker for the extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('📌 Image Saver extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveImage') {
        handleSaveImage(request)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep message channel open for async response
    }
});

// Save image to Discord
async function handleSaveImage(data) {
    const { imageUrl, postUrl, pageTitle, pageUrl } = data;

    try {
        // Fetch the image
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();

        // Convert blob to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imageBlob);
        });
        const imageDataUrl = await base64Promise;

        // Determine if this is from a social media site
        const isSocialMedia = pageUrl.includes('twitter.com') ||
            pageUrl.includes('x.com') ||
            pageUrl.includes('instagram.com') ||
            pageUrl.includes('pinterest.com');

        // Send to backend
        const response = await fetch('http://localhost:3001/api/save-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageDataUrl: imageDataUrl,
                postUrl: isSocialMedia ? postUrl : pageUrl,
                pageTitle: pageTitle,
                isSocialMedia: isSocialMedia
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save image');
        }

        return { success: true };

    } catch (error) {
        console.error('Error saving image:', error);
        throw error;
    }
}
