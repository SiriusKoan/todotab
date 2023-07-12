var numberOfLinks = 0;
const linkContainer = document.querySelector('#link-container');

const linkForm = document.querySelector('#link-form');
linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const linkTitle = document.querySelector('#link-title');
    const linkURL = document.querySelector('#link-url');
    chrome.storage.local.get(['links'], function (result) {
        let links = result.links || [];
        links.push({ "title": linkTitle.value, "url": linkURL.value });
        console.log(links)
        chrome.storage.local.set({ links: links }, function () {
            console.log(`Link ${linkTitle.value} saved`);
            // reset input
            linkTitle.value = '';
            linkURL.value = '';
        });
        renderLink(linkTitle.value, linkURL.value);
    });
});

function renderLinks() {
    // render all links
    chrome.storage.local.get(['links'], function (result) {
        let links = result.links || [];
        links.forEach(link => {
            renderLink(link.title, link.url);
        });
    });
}

function deleteLink(e) {
    e.preventDefault();
    const linkItem = e.target.parentElement.link_id ? e.target.parentElement : e.target; // click on icon or button
    console.log(linkItem);
    const linkId = linkItem.link_id;
    chrome.storage.local.get(['links'], function (result) {
        let links = result.links || [];
        links.splice(linkId, 1);
        chrome.storage.local.set({ links: links }, function () {
            console.log(`Link ${linkId} deleted`);
            console.log(linkItem.parentElement);
            linkItem.parentElement.remove();
        });
    });
}

function renderLink(title, url) {
    // render links refer to renderTodos in todo.js
    const linkDiv = document.createElement('a');
    linkDiv.classList.add('link-item');
    linkDiv.setAttribute('href', url);
    // delete btn
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.classList.add("link-delete-btn");
    const icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-trash");
    deleteButton.appendChild(icon);
    deleteButton.link_id = numberOfLinks;
    deleteButton.addEventListener("click", deleteLink);
    linkDiv.appendChild(deleteButton);
    // url
    const linkURL = document.createElement('span');
    linkURL.innerText = title;
    linkURL.classList.add('link-url');
    linkDiv.appendChild(linkURL);
    linkContainer.insertBefore(linkDiv, linkContainer.childNodes[0]);
    numberOfLinks++;
}