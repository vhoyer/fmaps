"use strict";

let map = document.getElementById("map");
let ctx = new My2dContext(map.getContext("2d"));

let w = map.width = window.innerWidth;
let h = map.height = window.innerHeight -4; //-4 pq sim

let img = new Image();
img.src = "img2.png";
img.onload = () => ctx.drawImage(img, 0, 0, 100, 100);
ctx.drawBackground(50);

ctx.draw = function(){
    ctx.drawBackground(50);
    ctx.drawImage(img, 0, 0, 100, 100);
}