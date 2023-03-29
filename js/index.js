const chooseImageButton = document.getElementById("choose-image-btn");

chooseImageButton.addEventListener("click", function() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function(event) {
        const selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = function() {
            const imageDataUrl = reader.result;
            console.log(imageDataUrl);
            chrome.storage.local.set({ "background-image": imageDataUrl }, function() {
                console.log("Background image saved to chrome storage.");
            });
            loadBackgroundImage();
        };
    };
    input.click();
});

const b64toBlob = (b64Data) => {
    contentType = "image/*";
    sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

window.addEventListener("load", function() {
    loadBackgroundImage();
});

function loadBackgroundImage(params) {
    chrome.storage.local.get("background-image", function(data) {
        const storedImage = data["background-image"];
        if (storedImage) {
            const blob = b64toBlob(storedImage.split(',')[1]);
            const blobUrl = URL.createObjectURL(blob);
            document.body.style.backgroundImage = `url(${blobUrl})`;
        }
    });
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    return `${year}-${month}-${date} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const dateTimeContainer = document.getElementById("date-time-container");
dateTimeContainer.innerText = getCurrentDateTime();
setInterval(function() {
    dateTimeContainer.innerText = getCurrentDateTime();
}, 1000);

window.onload = () => {
    renderTodos();
    renderLinks();
};