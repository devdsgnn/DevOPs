// DOM Elements
const captureBtn = document.getElementById('captureBtn');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
const pageTitle = document.getElementById('pageTitle');
const pageUrl = document.getElementById('pageUrl');

// Channel Selector Elements
const channelSearch = document.getElementById('channelSearch');
const channelList = document.getElementById('channelList');
const selectedChannelsContainer = document.getElementById('selectedChannels');

// State
let availableChannels = [];
let selectedChannels = [];

// Backend URL (your bot server)
const BACKEND_URL = 'http://localhost:3001';

// Load current page info and channels on startup
document.addEventListener('DOMContentLoaded', async () => {
    loadCurrentPageInfo();
    await fetchChannels();
});

// Load current page info
async function loadCurrentPageInfo() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        pageTitle.textContent = tab.title || 'Untitled';
        pageUrl.textContent = tab.url;
    } catch (error) {
        console.error('Error loading page info:', error);
        pageTitle.textContent = 'Error loading page';
        pageUrl.textContent = '';
    }
}

// Fetch available channels from backend
async function fetchChannels() {
    try {
        const listDiv = document.querySelector('.loading-text');
        if (listDiv) listDiv.textContent = 'Loading channels...';

        const response = await fetch(`${BACKEND_URL}/api/channels`);
        const data = await response.json();

        availableChannels = data.channels || [];
        console.log('Loaded channels:', availableChannels);

        if (availableChannels.length === 0) {
            if (listDiv) listDiv.textContent = 'No channels found.';
        } else {
            // Render initial list (hidden but ready)
            renderChannelList();
        }
    } catch (error) {
        console.error('Error fetching channels:', error);
        channelList.innerHTML = '<div class="loading-text">Error loading channels. Ensure backend is running.</div>';
    }
}

// Channel Selector Logic
channelSearch.addEventListener('focus', () => {
    channelList.classList.add('active');
    renderChannelList(channelSearch.value);
});

// Hide list when clicking outside (simple version)
document.addEventListener('click', (e) => {
    if (!channelSearch.contains(e.target) && !channelList.contains(e.target)) {
        channelList.classList.remove('active');
    }
});

channelSearch.addEventListener('input', (e) => {
    channelList.classList.add('active'); // Force show list on typing
    renderChannelList(e.target.value);
});

function renderChannelList(searchTerm = '') {
    // 1. Find all matches (including selected ones)
    const allMatches = availableChannels.filter(ch =>
        ch.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Filter out selected ones for the clickable list
    const selectable = allMatches.filter(ch =>
        !selectedChannels.find(sc => sc.id === ch.id)
    );

    // Case A: No channels match the search at all
    if (allMatches.length === 0) {
        channelList.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #86868b; font-size: 13px;">
                ${availableChannels.length === 0 ? 'No channels loaded' : 'No matching channels'}
            </div>
        `;
        return;
    }

    // Case B: Channels match, but ALL are already selected
    if (selectable.length === 0) {
        channelList.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #86868b; font-size: 13px;">
                All matching channels selected
            </div>
        `;
        return;
    }

    // Case C: Show selectable channels
    channelList.innerHTML = selectable.map(channel => `
        <div 
            class="channel-option" 
            data-id="${channel.id}"
            data-name="${channel.name}"
        >
            ${channel.name}
        </div>
    `).join('');

    // Add click listeners
    channelList.querySelectorAll('.channel-option').forEach(option => {
        option.addEventListener('click', () => {
            const channel = {
                id: option.dataset.id,
                name: option.dataset.name
            };
            addChannel(channel);
            channelSearch.value = '';
            channelSearch.focus();
        });
    });
}

function addChannel(channel) {
    if (selectedChannels.find(ch => ch.id === channel.id)) return;
    selectedChannels.push(channel);
    renderSelectedChannels();
    renderChannelList(channelSearch.value);
}

function removeChannel(channelId) {
    selectedChannels = selectedChannels.filter(ch => ch.id !== channelId);
    renderSelectedChannels();
    renderChannelList(channelSearch.value);
}

function renderSelectedChannels() {
    if (selectedChannels.length === 0) {
        selectedChannelsContainer.innerHTML = '<div class="placeholder-text">No channels selected (saving to default)</div>';
        captureBtn.innerHTML = 'Capture & Save to Default';
        return;
    }

    // Update button text
    captureBtn.innerHTML = `Capture & Save to ${selectedChannels.length} Channel(s)`;

    selectedChannelsContainer.innerHTML = selectedChannels.map(channel => `
        <div class="channel-tag">
            ${channel.name}
            <span class="remove-channel" data-id="${channel.id}">×</span>
        </div>
    `).join('');

    // Add remove listeners
    selectedChannelsContainer.querySelectorAll('.remove-channel').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click
            removeChannel(btn.dataset.id);
        });
    });
}

// Capture and save
captureBtn.addEventListener('click', async () => {
    try {
        captureBtn.disabled = true;
        progress.style.display = 'block';
        showStatus(status, 'Capturing screenshot...', 'info');

        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Capture visible tab
        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(null, {
            format: 'png',
            quality: 100
        });

        showStatus(status, 'Extracting metadata...', 'info');

        // Extract metadata from page
        const metadata = await extractMetadata(tab);

        showStatus(status, 'Sending to Discord & Notion...', 'info');

        // Prepare channels
        let finalChannels = selectedChannels;

        // If no channels selected, strictly look for 'Default' in the loaded list
        if (finalChannels.length === 0) {
            const defaultChannel = availableChannels.find(ch => ch.name.toLowerCase() === 'default');
            if (defaultChannel) {
                console.log('Using explicit Default channel from list:', defaultChannel);
                finalChannels = [defaultChannel];
            } else {
                // If 'Default' channel is missing from the DB list, warn the user
                throw new Error('No channels selected and "Default" channel not found in database.');
            }
        }

        // Send to backend
        const response = await fetch(`${BACKEND_URL}/api/save-inspiration`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: metadata.title,
                description: metadata.description,
                url: metadata.url,
                screenshot: screenshotDataUrl,
                channels: finalChannels // Send explicit list
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save');
        }

        progress.style.display = 'none';
        showStatus(status, 'Successfully saved!', 'success');

        // Reset after 3 seconds
        setTimeout(() => {
            captureBtn.disabled = false;
            status.classList.remove('show');
            // Optional: clear selection?
            // selectedChannels = [];
            // renderSelectedChannels();
        }, 3000);

    } catch (error) {
        console.error('Error capturing:', error);
        progress.style.display = 'none';

        // Check if backend is running
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            showStatus(status, 'Backend not running! Run: npm run 2', 'error');
        } else {
            showStatus(status, `Error: ${error.message}`, 'error');
        }

        captureBtn.disabled = false;
    }
});

// Extract metadata from page
async function extractMetadata(tab) {
    try {
        // Inject script to get metadata
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                const getMetaContent = (selector) => {
                    const element = document.querySelector(selector);
                    return element ? element.getAttribute('content') : null;
                };

                return {
                    title: getMetaContent('meta[property="og:title"]') ||
                        getMetaContent('meta[name="twitter:title"]') ||
                        document.title ||
                        'Untitled',
                    description: getMetaContent('meta[property="og:description"]') ||
                        getMetaContent('meta[name="twitter:description"]') ||
                        getMetaContent('meta[name="description"]') ||
                        '',
                    url: window.location.href
                };
            }
        });

        return results[0].result;
    } catch (error) {
        console.error('Error extracting metadata:', error);
        return {
            title: tab.title || 'Untitled',
            description: '',
            url: tab.url
        };
    }
}

// Utility function
function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status show ${type}`;
}
