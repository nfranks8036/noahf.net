import { SocialsList as SocialsList } from "../src/socialslist.js";
const socialMediaIcons = document.getElementById("socialMediaContainer")
const orderAdded = new Map();
const moveAmount = 25
const socials = new SocialsList().socials;

let current = 0;
let tasks = [];

for (var key in socials) {
    addIcon(key, socials[key].image, socials[key].redirect);
}

function isDefaultExpansion() {
    return window.innerWidth > 700;
}

function isFormerlyTwitter(element) {
    return element.outerHTML.toString().includes("x.png");
}

function addIcon(name, image, link) {
    const icon = document.createElement('img');

    icon.className = "social-media";
    icon.src = image;

    icon.addEventListener('click', function() {
        window.open(link);
    });

    socialMediaIcons.appendChild(icon)
    orderAdded.set(current++, icon)
}

function editWindow(newSizeElseZero = 0) {
    let size = (newSizeElseZero == 0 ? getComputedStyle(document.documentElement).getPropertyValue("--height") : newSizeElseZero);
    
    let element = document.getElementById("contact");
    element.style.height = size;
}

function getOtherElements(affected) {
    if (affected == undefined || affected.className != "social-media") return;

    let socialMedias = socialMediaIcons.getElementsByClassName("social-media");
    let excludedList = []
    let position = 0;
    for (let i = 0; i < socialMedias.length; i++) {
        let element = socialMedias[i];
        if (element == affected) {
            position = i;
            continue;
        }
        excludedList.push(element)
    }
    return [excludedList, position];
}

function executeListener(useZero, event) {
    let affected = event.target;
    if (affected.classList.contains('social-media')) {
        affected.style.transform = 'scale(' + (useZero ? 1 : (isDefaultExpansion() ? 1.75 : 1.25)) + ') ' + (isDefaultExpansion() ? 'translateY(' + (useZero ? 0 : 15) + 'px)' : '');

        /**
         * Make twitter icon appear suddenly and only for .3s (an ode to what X should be called)
         */
        if (isFormerlyTwitter(affected)) {
            tasks.push(setTimeout(function() {
                affected.src = "\\assets\\icons\\socials\\twitter.png";
                setTimeout(function () {
                    affected.src = "\\assets\\icons\\socials\\x.png";
                }, 300);
            }, 1000));
        }
    }

    if (isDefaultExpansion()) {
        let otherElementsRaw = getOtherElements(affected);
        if (otherElementsRaw == undefined || otherElementsRaw[0] == undefined) return; 
        let elements = otherElementsRaw[0];
        let position = otherElementsRaw[1];
        for(let i = 0; i < elements.length; i++) {
            let element = elements[i]
            element.style.transform = 'translateX(' + (useZero ? 0 : i < position ? 0 - moveAmount : moveAmount) + 'px)'
        }
    }

    editWindow(useZero ? 0 : isDefaultExpansion() ? "455px" : "100%");
}

window.onresize = function() {
    editWindow();
}

socialMediaIcons.addEventListener('mouseover', (event) => {
    executeListener(false, event);
})

socialMediaIcons.addEventListener('mouseout', (event) => {
    executeListener(true, event);
    for (let i = 0; i < tasks.length; i++) {
        window.clearTimeout(tasks[i]);
    }
})