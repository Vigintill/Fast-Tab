popup();
async function popup() {

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

    console.log("START");
    console.log(prevState);
    console.log(nextState);
    
    await chrome.action.setBadgeText({
        tabId: currentTab,
        text: nextState,
    });

    console.log("CHANGED");
    console.log(await chrome.action.getBadgeText({ tabId: currentTab}));

    getCurrentTab().then(async (tab) => {
        if (prevState === "OFF") {
            
            injectContentScript(tab)
        }
        else {
            disableContentScript(tab)
        }
    })

    disableContentScript = (tab) => {
        const {id, url} = tab;
        chrome.scripting.executeScript({
            target: {tabId: id, allFrames: true},
            files: ['scripts/disable_content.js']
        })
    }

    injectContentScript = (tab) => {
        const {id, url} = tab;
        chrome.scripting.executeScript({
            target: {tabId: id, allFrames: true},
            files: ['scripts/content.js'],
        })
    }
}

function focus() {
    
}