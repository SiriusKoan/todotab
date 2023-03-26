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
        console.log(storedImage)
        if (storedImage) {
            const blob = b64toBlob(storedImage.split(',')[1]);
            const blobUrl = URL.createObjectURL(blob);
            document.body.style.backgroundImage = `url(${blobUrl})`;
        }
    });
}
