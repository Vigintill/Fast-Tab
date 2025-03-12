elements = document.querySelectorAll("a[href]:not([tabindex='-1'])", "area[href]:not([tabindex='-1'])", "input:not([disabled]):not([tabindex='-1'])", "select:not([disabled]):not([tabindex='-1'])", "textarea:not([disabled]):not([tabindex='-1'])", "button:not([disabled]):not([tabindex='-1'])", "iframe:not([tabindex='-1'])", "[tabindex]:not([tabindex='-1'])", "[contentEditable=true]:not([tabindex='-1'])");
elements_inner = [];

console.log(elements.length);
for (let i = 0; i < elements.length; i++) {
    elements[i].style.setProperty('--content', `\'${i}\'`);
}