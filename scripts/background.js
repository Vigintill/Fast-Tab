chrome.runtime.onInstalled.addListener(() => {
    let elements;
    let focus_id;
    chrome.action.setBadgeText({
        text: "OFF",
    });
})