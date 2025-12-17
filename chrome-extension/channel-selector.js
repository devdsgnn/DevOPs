// Channel selector modal styles and logic
console.log('📢 Channel Selector Script Loaded!');

let channelModal = null;
let selectedChannels = [];
let availableChannels = [];

// Create channel selector modal
function createChannelModal() {
    const modal = document.createElement('div');
    modal.id = 'channel-selector-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 2147483647;
        width: 360px;
        max-height: 500px;
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
    `;

    modal.innerHTML = `
        <div style="margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1d1d1f;">Save to channels</h3>
            <p style="margin: 0; font-size: 13px; color: #86868b;">Select one or more channels</p>
        </div>
        
        <div id="selected-channels" style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; min-height: 32px;"></div>
        
        <div style="position: relative; margin-bottom: 16px;">
            <input 
                type="text" 
                id="channel-search" 
                placeholder="Search channels..."
                style="
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    background: #f5f5f7;
                    color: #1d1d1f;
                    font-size: 14px;
                    outline: none;
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    transition: all 0.2s ease;
                "
            />
            
            <div id="channel-list" style="
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                max-height: 200px;
                overflow-y: auto;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 100;
                margin-top: 8px;
                display: none;
            "></div>
        </div>
        
        <div style="display: flex; gap: 8px;">
            <button id="cancel-save" style="
                flex: 1;
                padding: 10px;
                background: #f5f5f7;
                color: #1d1d1f;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            ">Cancel</button>
            <button id="confirm-save" style="
                flex: 1;
                padding: 10px;
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            ">Save</button>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

// Create backdrop
function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.id = 'channel-modal-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 2147483646;
        display: none;
    `;
    document.body.appendChild(backdrop);
    return backdrop;
}

// Fetch available channels from backend
async function fetchChannels() {
    try {
        console.log('Fetching channels from http://localhost:3001/api/channels...');
        const response = await fetch('http://localhost:3001/api/channels');
        const data = await response.json();
        console.log('Received channels data:', data);
        availableChannels = data.channels || [];
        console.log('Available channels set to:', availableChannels);
        return availableChannels;
    } catch (error) {
        console.error('Error fetching channels:', error);
        availableChannels = []; // Ensure it's an array
        return [];
    }
}

// Render channel list based on search
function renderChannelList(searchTerm = '') {
    const channelList = document.getElementById('channel-list');
    if (!channelList) return;

    // Show list
    channelList.style.display = 'block';

    const filtered = availableChannels.filter(ch =>
        ch.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedChannels.find(sc => sc.id === ch.id)
    );

    if (filtered.length === 0) {
        channelList.innerHTML = `
            <div style="padding: 16px; text-align: center; color: #86868b; font-size: 13px;">
                No channels found
            </div>
        `;
        return;
    }

    channelList.innerHTML = filtered.map(channel => `
        <div 
            class="channel-option" 
            data-channel-id="${channel.id}"
            data-channel-name="${channel.name}"
            style="
                padding: 12px;
                cursor: pointer;
                border-bottom: 1px solid #f5f5f7;
                font-size: 14px;
                color: #1d1d1f;
                transition: background 0.15s ease;
                background: white;
            "
        >
            ${channel.name}
        </div>
    `).join('');

    // Add event listeners (CSP safe)
    channelList.querySelectorAll('.channel-option').forEach(option => {
        // Click handler
        option.addEventListener('click', () => {
            const channelId = option.dataset.channelId;
            const channelName = option.dataset.channelName;
            addChannel({ id: channelId, name: channelName });
            channelList.style.display = 'none'; // Hide after selection
        });

        // Hover effects
        option.addEventListener('mouseenter', () => {
            option.style.background = '#f5f5f7';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'white';
        });
    });
}

// Add channel to selected
function addChannel(channel) {
    if (selectedChannels.find(ch => ch.id === channel.id)) return;

    selectedChannels.push(channel);
    renderSelectedChannels();
    renderChannelList(document.getElementById('channel-search').value);
}

// Remove channel from selected
function removeChannel(channelId) {
    selectedChannels = selectedChannels.filter(ch => ch.id !== channelId);
    renderSelectedChannels();
    renderChannelList(document.getElementById('channel-search').value);
}

// Render selected channels as tags
function renderSelectedChannels() {
    const container = document.getElementById('selected-channels');
    if (!container) return;

    if (selectedChannels.length === 0) {
        container.innerHTML = `
            <div style="color: #86868b; font-size: 13px; padding: 6px 0;">
                No channels selected
            </div>
        `;
        return;
    }

    container.innerHTML = selectedChannels.map(channel => `
        <div style="
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #007AFF;
            color: white;
            padding: 6px 10px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 500;
        ">
            ${channel.name}
            <span 
                class="remove-channel" 
                data-channel-id="${channel.id}"
                style="
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1;
                    opacity: 0.8;
                "
            >×</span>
        </div>
    `).join('');

    // Add remove listeners
    container.querySelectorAll('.remove-channel').forEach(btn => {
        btn.addEventListener('click', () => {
            removeChannel(btn.dataset.channelId);
        });
    });
}

// Show channel modal
async function showChannelModal() {
    if (!channelModal) {
        channelModal = createChannelModal();
        createBackdrop();

        // Add click outside listener for dropdown
        document.addEventListener('click', (e) => {
            const searchInput = document.getElementById('channel-search');
            const channelList = document.getElementById('channel-list');
            if (searchInput && channelList &&
                !searchInput.contains(e.target) &&
                !channelList.contains(e.target)) {
                channelList.style.display = 'none';
            }
        });
    }

    // Reset state
    selectedChannels = [];

    // Fetch channels
    await fetchChannels();

    // Show modal
    channelModal.style.display = 'block';
    document.getElementById('channel-modal-backdrop').style.display = 'block';

    // Hide dropdown initially
    document.getElementById('channel-list').style.display = 'none';

    // Render
    renderSelectedChannels();
    // renderChannelList(); // Don't show list immediately

    // Focus search
    document.getElementById('channel-search').focus();

    // Setup search listener
    const searchInput = document.getElementById('channel-search');
    searchInput.value = '';
    searchInput.oninput = (e) => renderChannelList(e.target.value);
    searchInput.onfocus = (e) => renderChannelList(e.target.value); // Show on focus

    // Setup button listeners
    document.getElementById('cancel-save').onclick = hideChannelModal;
    document.getElementById('confirm-save').onclick = confirmSave;

    // Close on backdrop click
    document.getElementById('channel-modal-backdrop').onclick = hideChannelModal;
}

// Confirm save - will be overridden by caller
let confirmSaveCallback = null;
let cancelSaveCallback = null;

function confirmSave() {
    if (selectedChannels.length === 0) {
        alert('Please select at least one channel');
        return;
    }

    if (confirmSaveCallback) {
        confirmSaveCallback(selectedChannels);
    }

    // Don't call hide here, let the saving process handle it or do it after
    // Actually, we usually hide after confirming.
    hideChannelModal();
}

// Hide channel modal
function hideChannelModal() {
    if (channelModal) {
        channelModal.style.display = 'none';
        document.getElementById('channel-modal-backdrop').style.display = 'none';

        // Trigger cancel callback if it exists (and we're not saving)
        // Note: Logic here is a bit tricky. We might want to clear the callback 
        // after confirm so "hide" doesn't trigger cancel. 
        // But for "Saving..." button reset, it's fine if "Saved" state handles itself.
        // Let's just assume if this is called explicitly by user action (cancel button/backdrop), 
        // we want to reset.

        if (cancelSaveCallback) {
            cancelSaveCallback();
        }
    }
}

// Export for use in content.js
window.channelSelector = {
    show: showChannelModal,
    hide: hideChannelModal,
    setCallback: (callback) => { confirmSaveCallback = callback; },
    setCancelCallback: (callback) => { cancelSaveCallback = callback; }
};
