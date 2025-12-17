// Channel selector modal styles and logic - Dark Framer Style
console.log('📢 Channel Selector Script Loaded!');

let channelModal = null;
let selectedChannels = [];
let availableChannels = [];

// Create channel selector modal - Dark theme matching main popup
function createChannelModal() {
    const modal = document.createElement('div');
    modal.id = 'channel-selector-modal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000000;
        border-radius: 20px;
        padding: 18px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.05);
        z-index: 2147483647;
        width: 340px;
        max-height: 500px;
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
        overflow: hidden;
        position: relative;
    `;

    modal.innerHTML = `
        <div id="top-progress-bar" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 2px;
            background: #0a84ff;
            display: none;
            animation: progressAnim 1.5s ease-in-out infinite;
        "></div>
        
        <!-- Header with X button -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 0 4px;">
            <h3 style="margin: 0; font-size: 14px; font-weight: 500; color: #ffffff; display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 13px;">📸</span> Save to channels
            </h3>
            <button id="cancel-save" style="
                width: 24px;
                height: 24px;
                border-radius: 6px;
                border: none;
                background: transparent;
                color: #666666;
                font-size: 18px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.15s ease;
                padding: 0;
            ">×</button>
        </div>
        
        <!-- Search Input -->
        <div style="position: relative; margin-bottom: 12px;">
            <input 
                type="text" 
                id="channel-search" 
                placeholder="Search channels..."
                style="
                    width: 100%;
                    padding: 14px 18px;
                    border-radius: 14px;
                    border: none;
                    background: #1a1a1a;
                    color: #ffffff;
                    font-size: 14px;
                    outline: none;
                    box-sizing: border-box;
                    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                    transition: background 0.15s ease;
                "
            />
            
            <div id="channel-list" style="
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                max-height: 120px;
                overflow-y: auto;
                background: #1a1a1a;
                border-radius: 14px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
                z-index: 100;
                margin-top: 6px;
                display: none;
            "></div>
        </div>
        
        <!-- Selected Channels (below search) -->
        <div id="selected-channels" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; min-height: 28px;"></div>
        
        <!-- Save Button -->
        <button id="confirm-save" style="
            width: 100%;
            padding: 14px;
            background: #ffffff;
            color: #000000;
            border: none;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.15s ease;
        ">Save</button>
    `;

    document.body.appendChild(modal);

    // Add CSS animation for progress bar
    const style = document.createElement('style');
    style.textContent = `
        @keyframes progressAnim {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 100%; }
        }
    `;
    document.head.appendChild(style);

    // Add hover effects
    const cancelBtn = modal.querySelector('#cancel-save');
    const saveBtn = modal.querySelector('#confirm-save');

    cancelBtn.addEventListener('mouseenter', () => cancelBtn.style.color = '#ffffff');
    cancelBtn.addEventListener('mouseleave', () => cancelBtn.style.color = '#666666');

    saveBtn.addEventListener('mouseenter', () => { if (!saveBtn.disabled) saveBtn.style.background = '#e5e5e5'; });
    saveBtn.addEventListener('mouseleave', () => { if (!saveBtn.disabled) saveBtn.style.background = '#ffffff'; });

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
        availableChannels = [];
        return [];
    }
}

// Render channel list based on search
function renderChannelList(searchTerm = '') {
    const channelList = document.getElementById('channel-list');
    if (!channelList) return;

    channelList.style.display = 'block';

    const filtered = availableChannels.filter(ch =>
        ch.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedChannels.find(sc => String(sc.id) === String(ch.id))
    );

    if (filtered.length === 0) {
        channelList.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #555555; font-size: 12px;">
                ${availableChannels.length === 0 ? 'No channels loaded' : 'No matching channels'}
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
                padding: 11px 16px;
                cursor: pointer;
                font-size: 13px;
                color: #ffffff;
                transition: background 0.1s ease;
                background: transparent;
            "
        >
            ${channel.name}
        </div>
    `).join('');

    // Add event listeners
    channelList.querySelectorAll('.channel-option').forEach(option => {
        option.addEventListener('click', () => {
            const channelId = option.dataset.channelId;
            const channelName = option.dataset.channelName;
            addChannel({ id: channelId, name: channelName });
            channelList.style.display = 'none';
        });

        option.addEventListener('mouseenter', () => {
            option.style.background = '#2a2a2a';
        });
        option.addEventListener('mouseleave', () => {
            option.style.background = 'transparent';
        });
    });
}

// Add channel to selected
function addChannel(channel) {
    if (selectedChannels.find(ch => String(ch.id) === String(channel.id))) return;

    selectedChannels.push(channel);
    renderSelectedChannels();
    updateSaveButton();
    renderChannelList(document.getElementById('channel-search').value);
}

// Remove channel from selected
function removeChannel(channelId) {
    selectedChannels = selectedChannels.filter(ch => String(ch.id) !== String(channelId));
    renderSelectedChannels();
    updateSaveButton();
    renderChannelList(document.getElementById('channel-search').value);
}

// Update save button text
function updateSaveButton() {
    const saveBtn = document.getElementById('confirm-save');
    if (!saveBtn) return;

    if (selectedChannels.length === 0) {
        saveBtn.textContent = 'Save';
    } else {
        saveBtn.textContent = `Save (${selectedChannels.length})`;
    }
}

// Render selected channels as tags - Dark theme with white 20%
function renderSelectedChannels() {
    const container = document.getElementById('selected-channels');
    if (!container) return;

    if (selectedChannels.length === 0) {
        container.innerHTML = `
            <div style="color: #555555; font-size: 12px; padding: 4px 0;">
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
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 6px 12px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500;
        ">
            ${channel.name}
            <span 
                class="remove-channel" 
                data-channel-id="${channel.id}"
                style="
                    cursor: pointer;
                    font-size: 13px;
                    line-height: 1;
                    opacity: 0.7;
                "
            >×</span>
        </div>
    `).join('');

    // Add remove listeners
    container.querySelectorAll('.remove-channel').forEach(btn => {
        btn.addEventListener('click', () => {
            removeChannel(btn.dataset.channelId);
        });
        btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
        btn.addEventListener('mouseleave', () => btn.style.opacity = '0.7');
    });
}

// Show channel modal
async function showChannelModal() {
    if (!channelModal) {
        channelModal = createChannelModal();
        createBackdrop();

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

    // Hide progress bar
    document.getElementById('top-progress-bar').style.display = 'none';

    // Reset save button
    const saveBtn = document.getElementById('confirm-save');
    saveBtn.textContent = 'Save';
    saveBtn.style.background = '#ffffff';
    saveBtn.style.color = '#000000';
    saveBtn.disabled = false;

    // Render
    renderSelectedChannels();

    // Focus search
    document.getElementById('channel-search').focus();

    // Setup search listener
    const searchInput = document.getElementById('channel-search');
    searchInput.value = '';
    searchInput.oninput = (e) => renderChannelList(e.target.value);
    searchInput.onfocus = (e) => renderChannelList(e.target.value);

    // Setup button listeners
    document.getElementById('cancel-save').onclick = hideChannelModal;
    document.getElementById('confirm-save').onclick = confirmSave;

    // Close on backdrop click
    document.getElementById('channel-modal-backdrop').onclick = hideChannelModal;
}

// Confirm save callback
let confirmSaveCallback = null;
let cancelSaveCallback = null;

async function confirmSave() {
    const saveBtn = document.getElementById('confirm-save');
    const progressBar = document.getElementById('top-progress-bar');

    if (selectedChannels.length === 0) {
        // Flash the button red briefly
        saveBtn.style.background = '#ff453a';
        saveBtn.style.color = '#ffffff';
        saveBtn.textContent = 'Select channel';
        setTimeout(() => {
            saveBtn.style.background = '#ffffff';
            saveBtn.style.color = '#000000';
            saveBtn.textContent = 'Save';
        }, 1500);
        return;
    }

    // Show progress
    saveBtn.disabled = true;
    progressBar.style.display = 'block';
    saveBtn.textContent = 'Saving...';
    saveBtn.style.background = '#333333';
    saveBtn.style.color = '#666666';

    if (confirmSaveCallback) {
        try {
            await confirmSaveCallback(selectedChannels);

            // Success state
            progressBar.style.display = 'none';
            saveBtn.textContent = '✓ Saved';
            saveBtn.style.background = '#34C759';
            saveBtn.style.color = '#ffffff';

            setTimeout(() => {
                hideChannelModal();
            }, 1500);
        } catch (error) {
            // Error state
            progressBar.style.display = 'none';
            saveBtn.textContent = '✕ Error';
            saveBtn.style.background = '#ff453a';
            saveBtn.style.color = '#ffffff';

            setTimeout(() => {
                saveBtn.disabled = false;
                saveBtn.textContent = `Save (${selectedChannels.length})`;
                saveBtn.style.background = '#ffffff';
                saveBtn.style.color = '#000000';
            }, 2000);
        }
    }
}

// Hide channel modal
function hideChannelModal() {
    if (channelModal) {
        channelModal.style.display = 'none';
        document.getElementById('channel-modal-backdrop').style.display = 'none';

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
