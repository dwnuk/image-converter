let refs = {};
refs.imagePreviews = document.querySelector('.previews');
refs.fileSelector = document.querySelector('input[type=file]');
refs.outputFormat = document.getElementById('outputFormat');

function addImageBox(container) {
    let imageBox = document.createElement("div");
    imageBox.classList.add('previews__el', 'shadow');
    container.appendChild(imageBox);
    return imageBox;
}

function processFile(file, outputFormat) {
    if (!file) {
        return;
    }

    let imageBox = addImageBox(refs.imagePreviews);

    refs.imagePreviews.style.display = "flex";

    // Load the data into an image
    new Promise(function (resolve, reject) {
            let rawImage = new Image();

            rawImage.addEventListener("load", function () {
                resolve(rawImage);
            });

            rawImage.src = URL.createObjectURL(file);
        })
        .then(function (rawImage) {
            // Convert image to the desired format
            return new Promise(function (resolve, reject) {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");

                canvas.width = rawImage.width;
                canvas.height = rawImage.height;
                ctx.drawImage(rawImage, 0, 0);

                canvas.toBlob(function (blob) {
                    resolve(URL.createObjectURL(blob));
                }, "image/" + outputFormat); // Output format
            });
        })
        .then(function (imageURL) {
            // Load image for display on the page
            return new Promise(function (resolve, reject) {
                let scaledImg = new Image();

                scaledImg.addEventListener("load", function () {
                    resolve({
                        imageURL,
                        scaledImg
                    });
                });

                scaledImg.setAttribute("src", imageURL);
            });
        })
        .then(function (data) {
            // Create link element
            let imageLink = document.createElement("a");
            imageLink.setAttribute("href", data.imageURL);
            imageLink.setAttribute('download', `${file.name.slice(0, -4)}.${outputFormat}`);

            let imgPreviewBox = document.createElement("div");
            imgPreviewBox.classList.add('previews__image');

            // create description element
            let desc = document.createElement("p");
            desc.innerHTML =  `${file.name.slice(0, -4)}.${outputFormat}`;

            // Create scaled image element
            let scaledImg = data.scaledImg;

            imgPreviewBox.appendChild(scaledImg);
            imgPreviewBox.appendChild(desc);

            // Append elements to imageBox
            imageBox.appendChild(imgPreviewBox);
            imageBox.appendChild(imageLink);
        });
}

function processFiles(files) {
    const outputFormat = refs.outputFormat.value;
    for (let file of files) {
        processFile(file, outputFormat); // Pass output format
    }
}

function fileSelectorChanged() {
    processFiles(refs.fileSelector.files);
    refs.fileSelector.value = "";
}

refs.fileSelector.addEventListener("change", fileSelectorChanged);

// Set up Drag and Drop
function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(callback, e) {
    e.stopPropagation();
    e.preventDefault();
    callback(e.dataTransfer.files);
}

function setDragDrop(area, callback) {
    area.addEventListener("dragenter", dragenter, false);
    area.addEventListener("dragover", dragover, false);
    area.addEventListener("drop", function (e) {
        drop(callback, e);
    }, false);
}

const dragDropArea = document.querySelector('.dropTarget');

setDragDrop(dragDropArea, processFiles);


function downloadAll() {
    const imageLinks = document.querySelectorAll('.previews a');

    if (imageLinks.length === 0) {
        alert('No images to download');
        return;
    }

    const zip = new JSZip();

    const downloadPromises = [];

    for (let i = 0; i < imageLinks.length; i++) {
        const link = imageLinks[i];
        const imageURL = link.getAttribute('href');
        const imageName = link.getAttribute('download');
        const fileName = imageName.substring(imageName.lastIndexOf('/') + 1); // Extract original file name

        const downloadPromise = fetch(imageURL)
            .then(response => response.blob())
            .then(blob => {
                zip.file(fileName, blob);
            });

        downloadPromises.push(downloadPromise);
    }

    Promise.all(downloadPromises)
        .then(() => {
            zip.generateAsync({
                    type: 'blob'
                })
                .then(blob => {
                    // Save the ZIP file
                    const zipFileName = 'processed_images.zip';
                    saveAs(blob, zipFileName);
                });
        });
}

const downloadAllButton = document.querySelector('#downloadAllButton');
downloadAllButton.addEventListener('click', downloadAll);
