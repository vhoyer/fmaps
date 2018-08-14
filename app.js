"use strict";

let map = document.getElementById("map");
let ctx = new My2dContext(map.getContext("2d"));

let w = map.width = window.innerWidth;
let h = map.height = window.innerHeight -4; //-4 pq sim

ctx.draw = function(){
    ctx.drawBackground(200);
    ctx.drawImage(img, 0, 0, 100, 100);

    ctx.beginPath();
    ctx._ctx.moveTo(ctx.focusPoint.x - 20, ctx.focusPoint.y);
    ctx._ctx.lineTo(ctx.focusPoint.x + 20, ctx.focusPoint.y);
    ctx._ctx.moveTo(ctx.focusPoint.x, ctx.focusPoint.y - 20);
    ctx._ctx.lineTo(ctx.focusPoint.x, ctx.focusPoint.y + 20);
    ctx.strokeStyle = "#f00";
    ctx.stroke();

    //debug
    ctx.debug();
}

let img = new Image();
img.src = "img2.png";
img.onload = () => ctx.draw();
