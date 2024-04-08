// Define an object to store references to DOM elements
let refs = {};
refs.imagePreviews = document.querySelector('.previews'); // Reference to the container for image previews
refs.fileSelector = document.querySelector('input[type=file]'); // Reference to the file input element

const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", () =>
    optionMenu.classList.toggle("active")
);

options.forEach((option) => {
    option.addEventListener("click", () => {
        let selectedOption = option.innerText;
        sBtn_text.innerText = selectedOption;

        optionMenu.classList.remove("active");
    });
});

// Function to add a new image box to the previews container
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

    // Validate input file type
    const allowedInputFormats = ['.png', '.jpg', '.jpeg', '.webp'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const warning = document.querySelector('.warning');
    if (!allowedInputFormats.includes(fileExtension)) {
        warning.style.display = 'block'
        warning.innerHTML = 'File type not supported';
        return;
    } else if (fileExtension === '.' + outputFormat.toLowerCase()) {
        warning.style.display = 'block'
        warning.innerHTML = `File can't have the same format as choosen output`;
        return;
    } else {
        // Hide warning message if the file type and output format match
        warning.style.display = 'none'
    }

    let imageBox = addImageBox(refs.imagePreviews); // Add a new image box

    refs.imagePreviews.style.display = "flex"; // Display the previews container

    // Load the data into an image
    new Promise(function(resolve, reject) {
            let rawImage = new Image();

            rawImage.addEventListener("load", function() {
                resolve(rawImage);
            });

            rawImage.src = URL.createObjectURL(file);
        })
        .then(function(rawImage) {
            // Convert image to the desired format
            return new Promise(function(resolve, reject) {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext("2d");

                canvas.width = rawImage.width;
                canvas.height = rawImage.height;
                ctx.drawImage(rawImage, 0, 0);

                canvas.toBlob(function(blob) {
                    resolve(URL.createObjectURL(blob));
                }, "image/" + outputFormat); // Output format
            });
        })
        .then(function(imageURL) {
            // Load image for display on the page
            return new Promise(function(resolve, reject) {
                let scaledImg = new Image();

                scaledImg.addEventListener("load", function() {
                    resolve({
                        imageURL,
                        scaledImg
                    });
                });

                scaledImg.setAttribute("src", imageURL);
            });
        })
        .then(function(data) {
            // Create link element
            let imageLink = document.createElement("a");
            imageLink.setAttribute("href", data.imageURL);
            imageLink.setAttribute('download', `${file.name.slice(0, -4)}.${outputFormat}`);

            let imgPreviewBox = document.createElement("div");
            imgPreviewBox.classList.add('previews__image');

            // create description element
            let desc = document.createElement("p");
            desc.innerHTML = `${file.name.slice(0, -4)}.${outputFormat}`;

            // Create scaled image element
            let scaledImg = data.scaledImg;

            imgPreviewBox.appendChild(scaledImg);
            imgPreviewBox.appendChild(desc);

            // Append elements to imageBox
            imageBox.appendChild(imgPreviewBox);
            imageBox.appendChild(imageLink);
        });
}

// Function to process multiple files
function processFiles(files) {
    const outputFormat = sBtn_text.innerText.toLowerCase(); // Get selected output format from custom select menu
    for (let file of files) {
        processFile(file, outputFormat); // Pass output format
    }
}

// Event handler for file selector change
function fileSelectorChanged() {
    processFiles(refs.fileSelector.files);
    refs.fileSelector.value = ""; // Reset file selector value after processing files
}

refs.fileSelector.addEventListener("change", fileSelectorChanged);

// Drag and Drop functionality setup
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
    area.addEventListener("drop", function(e) {
        drop(callback, e);
    }, false);
}

const dragDropArea = document.querySelector('.dropTarget');
setDragDrop(dragDropArea, processFiles); // Set up drag and drop for processing files

// Function to download all processed images as a zip file
function downloadAll() {
    const imageLinks = document.querySelectorAll('.previews a');

    if (imageLinks.length === 0) {
        alert('No images to download');
        return;
    }

    const zip = new JSZip(); // Create a new instance of JSZip for creating zip archive
    const downloadPromises = [];

    for (let i = 0; i < imageLinks.length; i++) {
        const link = imageLinks[i];
        const imageURL = link.getAttribute('href');
        const imageName = link.getAttribute('download');
        const fileName = imageName.substring(imageName.lastIndexOf('/') + 1); // Extract original file name

        const downloadPromise = fetch(imageURL)
            .then(response => response.blob())
            .then(blob => {
                zip.file(fileName, blob); // Add each image file to the zip archive
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
                    saveAs(blob, zipFileName); // Save the generated zip file
                });
        });
}

const downloadAllButton = document.querySelector('#downloadAllButton');
downloadAllButton.addEventListener('click', downloadAll); // Add event listener to download all button
