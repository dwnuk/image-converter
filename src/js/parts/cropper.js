import Cropper from 'cropperjs';

// Initialize Cropper.js instance
var cropper = null;

// Event listener for file input change
document.getElementById('imageInput').onchange = function (event) {
    var files = event.target.files;
    var image = files[0];
    var reader = new FileReader();

    reader.onload = function () {
        var img = new Image();
        img.src = reader.result;

        img.onload = function () {
            var imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = ''; // Clear existing image
            imageContainer.appendChild(img);

            // If cropper instance doesn't exist, create one
            if (!cropper) {
                cropper = new Cropper(img, {
                    aspectRatio: 0, // Free aspect ratio
                    viewMode: 2, // Display mode
                    zoomable: false, // Disable zooming
                    background: true, // Show background
                    crop(event) { // Crop event handler
                        var data = cropper.getData();
                        // Display crop data
                        document.getElementById('cropDataDisplay').innerHTML =
                            'Width: ' + Math.round(data.width) + 'px' + '<br>' +
                            'Height: ' + Math.round(data.height) + 'px' + '<br>';
                            updatePreview();
                            updatePreview();
                    }

                });
            } else {
                // Replace existing cropper image with new one
                cropper.replace(img.src);
            }
        };
    };

    reader.readAsDataURL(image); // Read image file as data URL
};

// Event listener for crop button click
document.getElementById('cropButton').addEventListener('click', function () {
    var img = document.getElementById('image-container').getElementsByTagName('img')[0];
    var canvas = cropper.getCroppedCanvas();
    if (!canvas) {
        return; // Return if no cropped canvas available
    }
    // Create cropped image element dynamically
    var croppedImageData = canvas.toDataURL();
    var croppedImage = new Image();
    croppedImage.src = croppedImageData;

    // Remove existing cropped image, if any
    var croppedImageContainer = document.getElementById('cropped-image-container');
    croppedImageContainer.innerHTML = '';

    // Append cropped image to container
    croppedImageContainer.appendChild(croppedImage);
    croppedImageContainer.style.display = "block";
});

// Event listener for download button click
document.getElementById('downloadButton').addEventListener('click', function () {
    var croppedImage = document.getElementById('cropped-image-container').getElementsByTagName('img')[0];
    var downloadLink = document.createElement('a');
    downloadLink.href = croppedImage.src;
    downloadLink.download = 'cropped_image.png';
    downloadLink.click(); // Trigger download link
});

// Function to update live preview of cropped image
function updatePreview() {
    if (!cropper) return; // Return if no cropper instance

    var previewCanvas = document.getElementById('preview');
    var previewCtx = previewCanvas.getContext('2d');

    var canvas = cropper.getCroppedCanvas();
    if (!canvas) return; // Return if no cropped canvas available

    var croppedImageData = canvas.toDataURL();
    var previewImage = new Image();
    previewImage.src = croppedImageData;
    previewImage.onload = function () {
        var aspectRatio = canvas.width / canvas.height;
        var previewWidth = 200;
        var previewHeight = previewWidth / aspectRatio;
        previewCanvas.width = previewWidth;
        previewCanvas.height = previewHeight;
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.drawImage(previewImage, 0, 0, previewWidth, previewHeight);
    };
}