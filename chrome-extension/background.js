// Background service worker for the extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('📌 Site Inspiration Saver extension installed');
});

// Listen for extension icon click - open the centered modal
chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.tabs.sendMessage(tab.id, { action: 'openModal' });
    } catch (error) {
        console.error('Error opening modal:', error);
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveImage') {
        handleSaveImage(request)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep message channel open for async response
    }

    if (request.action === 'captureScreenshot') {
        chrome.tabs.captureVisibleTab(null, { format: 'png', quality: 100 })
            .then(screenshot => sendResponse({ success: true, screenshot }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
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
