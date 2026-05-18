/**
 * Main Application Logic
 * Initializes common components across all pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Generate or retrieve Session GUID
    let sessionGuid = sessionStorage.getItem('blossom_guid');
    if (!sessionGuid) {
        sessionGuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        sessionStorage.setItem('blossom_guid', sessionGuid);
    }
    window.SESSION_GUID = sessionGuid;

    const urlParams = new URLSearchParams(window.location.search);
    window.SESSION_SOURCE = urlParams.get('source') || 'direct';

    console.log('[BLOSSOM TRAIL] Session started. GUID: ' + window.SESSION_GUID);
});
