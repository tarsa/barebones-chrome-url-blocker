'use strict';

const logPrefix = 'Bare-bones Chrome URL blocker';

const urlFilters = [
    "||fb.com",
    "||fb.net",
    "||facebook.net",
    "||facebook.com",
    "||meta.com",
    "||messenger.com"
];
// try adding something non-existent and Chrome will show you
//     the full list in error message during extension loading
const resourceTypes = [
    "csp_report",
    "font",
    "image",
    "main_frame",
    "media",
    "object",
    "ping",
    "script",
    "stylesheet",
    "sub_frame",
    "webbundle",
    "websocket",
    "webtransport",
    "xmlhttprequest",
    "other"
];

(async () => {
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map(rule => rule.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds,
        addRules: urlFilters.map((urlFilter, idx) => (
            {
                id: idx + 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: urlFilter,
                    resourceTypes: resourceTypes
                }
            }
        ))
    });
})();

// if you don't need this debug logging then remove also
//    declarativeNetRequestFeedback permission from manifest.json
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
    const msg = `[${logPrefix}] Navigation blocked` +
        ` to ${e.request.url} from initiator ${e.request.initiator}.`;
    console.log(msg);
});

console.log(`[${logPrefix}] Service worker started.`);
