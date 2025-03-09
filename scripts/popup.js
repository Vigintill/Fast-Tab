popup();
async function popup() {

    const input = document.getElementById("input");

    const show_btn = document.getElementById("show");
    show_btn.addEventListener('click', count)

    const focus_btn = document.getElementById("focus");
    focus_btn.addEventListener('click', focus)
}

async function getCurrentTab() {
    let queryOptions = { active: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function count() {
    const currentTab = (await getCurrentTab()).id;

    const prevState = await chrome.action.getBadgeText({ tabId: currentTab});
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    await chrome.action.setBadgeText({
        tabId: currentTab,
        text: nextState,
    });

    getCurrentTab().then(async (tab) => {
        if (prevState === "OFF") {
            chrome.scripting.insertCSS({
                target: {tabId: tab.id},
                files: ["styles/highlight.css"]
            });

            injectContentScript(tab)
        }
        else {
            chrome.scripting.removeCSS({
                target: {tabId: tab.id},
                files: ["styles/highlight.css"]
            });
            
            disableContentScript(tab)
        }
    })
}

function injectContentScript(tab) {
    const {id, url} = tab;
    chrome.scripting.executeScript({
        target: {tabId: id, allFrames: true},
        files: ['scripts/content.js'],
    })
}

function disableContentScript(tab) {
    const {id, url} = tab;
    chrome.scripting.executeScript({
        target: {tabId: id, allFrames: true},
        files: ['scripts/disable_content.js']
    })
}

async function focus() {

    if (input.value != "") {

        const currentTab = (await getCurrentTab())

        const prevState = await chrome.action.getBadgeText({ tabId: currentTab.id});
        const nextState = prevState === 'ON' ? 'OFF' : 'ON';

        if (prevState === 'ON') {
            await chrome.action.setBadgeText({
                tabId: currentTab.id,
                text: nextState,
            });

            chrome.scripting.removeCSS({
                target: {tabId: currentTab.id},
                files: ["styles/highlight.css"]
            });
            
            disableContentScript(tab)
        }

        chrome.scripting.executeScript({
            target: {tabId: currentTab.id},
            func: setInputValue,
            args : [ input.value ]
        });

        window.close();

        chrome.scripting.executeScript({
            target: {tabId: currentTab.id},
            files: ["scripts/focus.js"]
        });
    }
    else {
        console.log("No input");
    }
}

function setInputValue(value) {
    focus_id = value;
}