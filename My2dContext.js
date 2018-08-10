"use strict";

class My2dContext {

    constructor(ctx){
        this.ctx = ctx;
        this._zoom = 1;

        this.canvas.addEventListener('mousewheel', (e) => {
            if (e.deltaY > 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        }, { passive: true });
    }

    get drawFunction() { return this.draw }
    set drawFunction(value) { this.draw = value }

    get canvas() { return this.ctx.canvas; }
    set canvas(value) { this.ctx.canvas = value; }

    get zoom() { return this._zoom; }
    set zoom(value) {
        if (value < 0.05){
            return;
        }
        this._zoom = value;
        this.draw();
    }

    get w() {
        return this.canvas.width / this.zoom;
    }

    get h() {
        return this.canvas.height / this.zoom;
    }

    get fillStyle() { return this.ctx.fillStyle; }
    set fillStyle(value) { this.ctx.fillStyle = value; }

    get strokeStyle() { return this.ctx.strokeStyle; }
    set strokeStyle(value) { this.ctx.strokeStyle = value }

    fillRect(){ return this.ctx.fillRect(...arguments); }
    beginPath() { return this.ctx.beginPath(); }
    stroke() { return this.ctx.stroke(); }
    drawImage() {
        //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
        if (arguments.length === 5){
            return this.ctx.drawImage(
                arguments[0], //thats the image
                arguments[1] * this.zoom,
                arguments[2] * this.zoom,
                arguments[3] * this.zoom,
                arguments[4] * this.zoom
            );
        }
        return this.ctx.drawImage(...arguments);
    }
    moveTo(x,y) {
        //https://developer.mozilla.org/pt-BR/docs/Web/API/CanvasRenderingContext2D/moveTo
        return this.ctx.moveTo(
            x * this.zoom,
            y * this.zoom
        );
    }
    lineTo(x, y) {
        //https://developer.mozilla.org/pt-BR/docs/Web/API/CanvasRenderingContext2D/lineTo
        return this.ctx.lineTo(
            x * this.zoom,
            y * this.zoom
        );
    }

    zoomIn(){
        this.zoom += 0.05;
    }
    zoomOut(){
        this.zoom -= 0.05;
    }

    drawBackground(sqr) {
        this.fillStyle = "#FFFDF7";
        this.fillRect(0, 0, w, h);

        this.beginPath();
        for (let i = 0; i < this.w / sqr; i++) {
            this.moveTo(sqr * i, 0     );
            this.lineTo(sqr * i, this.h);
        }
        for (let i = 0; i < this.h / sqr; i++) {
            this.moveTo(0     , sqr * i);
            this.lineTo(this.w, sqr * i);
        }
        this.strokeStyle = "#FFEECE";
        this.stroke();
    }
};
