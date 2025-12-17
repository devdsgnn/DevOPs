// Modal content script - shows centered modal like Framer
(function () {
    'use strict';

    let modalInjected = false;
    let modalElement = null;
    let availableChannels = [];
    let selectedChannels = [];
    const BACKEND_URL = 'http://localhost:3001';

    // Inject modal HTML and CSS
    function injectModal() {
        if (modalInjected) return;

        // Inject CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = chrome.runtime.getURL('modal.css');
        document.head.appendChild(cssLink);

        // Inject HTML
        fetch(chrome.runtime.getURL('modal.html'))
            .then(response => response.text())
            .then(html => {
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = html;
                document.body.appendChild(modalContainer.firstElementChild);

                modalElement = document.getElementById('siteInspirationModal');
                initializeModal();
                modalInjected = true;
            });
    }

    // Initialize modal functionality
    function initializeModal() {
        const closeBtn = document.getElementById('closeModal');
        const captureBtn = document.getElementById('captureBtn');
        const channelSearch = document.getElementById('channelSearch');
        const channelList = document.getElementById('channelList');
        const selectedChannelsContainer = document.getElementById('selectedChannels');
        const status = document.getElementById('status');
        const progress = document.getElementById('progress');

        // Safety check
        if (!modalElement || !closeBtn || !captureBtn) {
            console.error('Modal elements not found');
            return;
        }

        // Close modal on X button
        closeBtn.addEventListener('click', hideModal);

        // Close modal on backdrop click
        modalElement.addEventListener('click', (e) => {
            if (e.target === modalElement || e.target.classList.contains('modal-overlay')) {
                hideModal();
            }
        });

        // Channel selector logic
        if (channelSearch && channelList) {
            channelSearch.addEventListener('focus', () => {
                channelList.classList.add('active');
                renderChannelList(channelSearch.value);
            });

            document.addEventListener('click', (e) => {
                if (!channelSearch.contains(e.target) && !channelList.contains(e.target)) {
                    channelList.classList.remove('active');
                }
            });

            channelSearch.addEventListener('input', (e) => {
                channelList.classList.add('active');
                renderChannelList(e.target.value);
            });
        }

        // Capture button
        captureBtn.addEventListener('click', captureAndSave);

        // Load page info and channels
        loadCurrentPageInfo();
        fetchChannels();
    }

    // Show modal
    function showModal() {
        // Reset state
        selectedChannels = [];

        if (!modalInjected) {
            injectModal();
            // Wait a bit for injection to complete
            setTimeout(() => {
                if (modalElement) {
                    modalElement.style.display = 'flex';
                    resetModalState();
                }
            }, 100);
        } else {
            modalElement.style.display = 'flex';
            resetModalState();
        }
    }

    // Reset modal state
    function resetModalState() {
        // Clear search
        const channelSearch = document.getElementById('channelSearch');
        if (channelSearch) channelSearch.value = '';

        // Reset selected channels display
        renderSelectedChannels();

        // Load data
        loadCurrentPageInfo();
        fetchChannels();
    }

    // Hide modal
    function hideModal() {
        if (modalElement) {
            modalElement.style.display = 'none';
        }
    }

    // Load current page info
    function loadCurrentPageInfo() {
        const pageTitle = document.getElementById('pageTitle');
        const pageUrl = document.getElementById('pageUrl');

        if (pageTitle) pageTitle.textContent = document.title || 'Untitled';
        if (pageUrl) pageUrl.textContent = window.location.href;
    }

    // Fetch channels from backend
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
                renderChannelList();
                // Show the list with channels
                const channelList = document.getElementById('channelList');
                if (channelList) {
                    channelList.classList.add('active');
                }
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
            const channelList = document.getElementById('channelList');
            if (channelList) {
                channelList.innerHTML = '<div class="loading-text">Error loading channels. Ensure backend is running.</div>';
            }
        }
    }

    // Render channel list
    function renderChannelList(searchTerm = '') {
        const channelList = document.getElementById('channelList');
        if (!channelList) return;

        const allMatches = availableChannels.filter(ch =>
            ch.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Use String() to ensure consistent comparison
        const selectable = allMatches.filter(ch =>
            !selectedChannels.find(sc => String(sc.id) === String(ch.id))
        );

        if (allMatches.length === 0) {
            channelList.innerHTML = `
                <div style="padding: 12px; text-align: center; color: #86868b; font-size: 13px;">
                    ${availableChannels.length === 0 ? 'No channels loaded' : 'No matching channels'}
                </div>
            `;
            return;
        }

        if (selectable.length === 0) {
            channelList.innerHTML = `
                <div style="padding: 12px; text-align: center; color: #86868b; font-size: 13px;">
                    All matching channels selected
                </div>
            `;
            return;
        }

        channelList.innerHTML = selectable.map(channel => `
            <div 
                class="channel-option" 
                data-id="${channel.id}"
                data-name="${channel.name}"
            >
                ${channel.name}
            </div>
        `).join('');

        channelList.querySelectorAll('.channel-option').forEach(option => {
            option.addEventListener('click', () => {
                const channel = {
                    id: option.dataset.id,
                    name: option.dataset.name
                };
                addChannel(channel);
                const channelSearch = document.getElementById('channelSearch');
                if (channelSearch) {
                    channelSearch.value = '';
                    channelSearch.focus();
                }
            });
        });
    }

    // Add channel
    function addChannel(channel) {
        if (selectedChannels.find(ch => ch.id === channel.id)) return;
        selectedChannels.push(channel);
        renderSelectedChannels();
        renderChannelList(document.getElementById('channelSearch')?.value || '');
    }

    // Remove channel
    function removeChannel(channelId) {
        selectedChannels = selectedChannels.filter(ch => ch.id !== channelId);
        renderSelectedChannels();
        renderChannelList(document.getElementById('channelSearch')?.value || '');
    }

    // Render selected channels
    function renderSelectedChannels() {
        const selectedChannelsContainer = document.getElementById('selectedChannels');
        const captureBtn = document.getElementById('captureBtn');

        if (!selectedChannelsContainer) return;

        if (selectedChannels.length === 0) {
            selectedChannelsContainer.innerHTML = '<div class="placeholder-text">No channels selected</div>';
            if (captureBtn) captureBtn.innerHTML = 'Save';
            return;
        }

        if (captureBtn) captureBtn.innerHTML = `Save (${selectedChannels.length})`;

        selectedChannelsContainer.innerHTML = selectedChannels.map(channel => `
            <div class="channel-tag">
                ${channel.name}
                <span class="remove-channel" data-id="${channel.id}">×</span>
            </div>
        `).join('');

        selectedChannelsContainer.querySelectorAll('.remove-channel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeChannel(btn.dataset.id);
            });
        });
    }

    // Capture and save
    async function captureAndSave() {
        const captureBtn = document.getElementById('captureBtn');
        const topProgress = document.getElementById('topProgress');
        const originalText = captureBtn.innerHTML;

        try {
            captureBtn.disabled = true;
            topProgress.style.display = 'block';
            captureBtn.innerHTML = 'Capturing...';

            // Request screenshot from background script
            const response = await chrome.runtime.sendMessage({ action: 'captureScreenshot' });

            if (!response.success) {
                throw new Error(response.error || 'Failed to capture screenshot');
            }

            captureBtn.innerHTML = 'Sending...';

            let finalChannels = selectedChannels;

            if (finalChannels.length === 0) {
                const defaultChannel = availableChannels.find(ch => ch.name.toLowerCase() === 'default');
                if (defaultChannel) {
                    finalChannels = [defaultChannel];
                } else {
                    throw new Error('No channels selected and "Default" channel not found.');
                }
            }

            const saveResponse = await fetch(`${BACKEND_URL}/api/save-inspiration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: document.title,
                    description: document.querySelector('meta[name="description"]')?.content || '',
                    url: window.location.href,
                    screenshot: response.screenshot,
                    channels: finalChannels
                })
            });

            if (!saveResponse.ok) {
                const error = await saveResponse.json();
                throw new Error(error.error || 'Failed to save');
            }

            topProgress.style.display = 'none';
            captureBtn.innerHTML = '✓ Saved';
            captureBtn.style.background = '#34C759';
            captureBtn.style.color = '#ffffff';

            setTimeout(() => {
                captureBtn.disabled = false;
                captureBtn.innerHTML = originalText;
                captureBtn.style.background = '';
                captureBtn.style.color = '';
                hideModal();
            }, 1500);

        } catch (error) {
            console.error('Error capturing:', error);

            topProgress.style.display = 'none';
            captureBtn.innerHTML = '✕ Error';
            captureBtn.style.background = '#ff453a';
            captureBtn.style.color = '#ffffff';

            setTimeout(() => {
                captureBtn.disabled = false;
                captureBtn.innerHTML = originalText;
                captureBtn.style.background = '';
                captureBtn.style.color = '';
            }, 2000);
        }
    }

    // Show status
    function showStatus(message, type) {
        const status = document.getElementById('status');
        if (status) {
            status.textContent = message;
            status.className = `status show ${type}`;
        }
    }

    // Listen for keyboard shortcut (Cmd/Ctrl + Shift + S)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            showModal();
        }
    });

    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'openModal') {
            showModal();
            sendResponse({ success: true });
        }
    });

    console.log('📸 Site Inspiration Modal loaded - Press Cmd/Ctrl+Shift+S to open');
})();
