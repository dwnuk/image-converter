(()=>{var e={264:()=>{let e={};e.imagePreviews=document.querySelector(".previews"),e.fileSelector=document.querySelector("input[type=file]");const t=document.querySelector(".select-menu"),n=t.querySelector(".select-btn"),r=t.querySelectorAll(".option"),o=t.querySelector(".sBtn-text");function i(t,n){if(!t)return;const r=t.name.substring(t.name.lastIndexOf(".")).toLowerCase(),o=document.querySelector(".warning");if(![".png",".jpg",".jpeg",".webp"].includes(r))return o.style.display="block",void(o.innerHTML="File type not supported");if(r==="."+n.toLowerCase())return o.style.display="block",void(o.innerHTML="File can't have the same format as choosen output");o.style.display="none";let i=function(e){let t=document.createElement("div");return t.classList.add("previews__el","shadow"),e.appendChild(t),t}(e.imagePreviews);e.imagePreviews.style.display="flex",new Promise((function(e,n){let r=new Image;r.addEventListener("load",(function(){e(r)})),r.src=URL.createObjectURL(t)})).then((function(e){return new Promise((function(t,r){let o=document.createElement("canvas"),i=o.getContext("2d");o.width=e.width,o.height=e.height,i.drawImage(e,0,0),o.toBlob((function(e){t(URL.createObjectURL(e))}),"image/"+n)}))})).then((function(e){return new Promise((function(t,n){let r=new Image;r.addEventListener("load",(function(){t({imageURL:e,scaledImg:r})})),r.setAttribute("src",e)}))})).then((function(e){let r=document.createElement("a");r.setAttribute("href",e.imageURL),r.setAttribute("download",`${t.name.slice(0,-4)}.${n}`);let o=document.createElement("div");o.classList.add("previews__image");let a=document.createElement("p");a.innerHTML=`${t.name.slice(0,-4)}.${n}`;let l=e.scaledImg;o.appendChild(l),o.appendChild(a),i.appendChild(o),i.appendChild(r)}))}function a(e){const t=o.innerText.toLowerCase();for(let n of e)i(n,t)}n.addEventListener("click",(()=>t.classList.toggle("active"))),r.forEach((e=>{e.addEventListener("click",(()=>{let n=e.innerText;o.innerText=n,t.classList.remove("active")}))})),e.fileSelector.addEventListener("change",(function(){a(e.fileSelector.files),e.fileSelector.value=""}));const l=document.querySelector(".dropTarget");var s,c;c=a,(s=l).addEventListener("dragenter",(function(e){e.stopPropagation(),e.preventDefault()}),!1),s.addEventListener("dragover",(function(e){e.stopPropagation(),e.preventDefault()}),!1),s.addEventListener("drop",(function(e){!function(e,t){t.stopPropagation(),t.preventDefault(),e(t.dataTransfer.files)}(c,e)}),!1),document.querySelector("#downloadAllButton").addEventListener("click",(function(){const e=document.querySelectorAll(".previews a");if(0===e.length)return void alert("No images to download");const t=new JSZip,n=[];for(let r=0;r<e.length;r++){const o=e[r],i=o.getAttribute("href"),a=o.getAttribute("download"),l=a.substring(a.lastIndexOf("/")+1),s=fetch(i).then((e=>e.blob())).then((e=>{t.file(l,e)}));n.push(s)}Promise.all(n).then((()=>{t.generateAsync({type:"blob"}).then((e=>{saveAs(e,"processed_images.zip")}))}))}))}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";n(264)})()})();
//# sourceMappingURL=index.c03a263775555a6819fb.bundle.js.map