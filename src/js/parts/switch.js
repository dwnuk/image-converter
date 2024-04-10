 const convertSwitch = document.getElementById('convert');
 const cropSwitch = document.getElementById('crop');

 const converter = document.querySelector('.converter');
 const cropper = document.querySelector('.cropper');

 // Add event listeners to each button
 convertSwitch.addEventListener('click', () => toggleActive(convertSwitch, cropSwitch, converter, cropper));
 cropSwitch.addEventListener('click', () => toggleActive(cropSwitch, convertSwitch, cropper, converter));

 // Function to toggle active class between buttons
 function toggleActive(switch1, switch2, app1, app2) {
    switch1.classList.add('active');
    switch2.classList.remove('active');

    app1.classList.add('active');
        app2.classList.remove('active');
 }